---
title: "Circuit Breakers in Python"
date: 2020-02-18T20:57:00-04:00
tags: ["python", "microservices", "circuitbreaker", "architecture"]
---
The [Circuit Breaker pattern](https://en.wikipedia.org/wiki/Circuit_breaker_design_pattern) is commonly used in microservice architectures to fail quickly when an external service is down. This prevents a single service from bringing down the entire system and allows functionality to gracefully degrade.

I spent part of the last weekend building my own [version](https://pypi.org/project/pycircuitbreaker/) of a circuit breaker. There are already [many](https://pypi.org/search/?q=circuit+breaker) existing implementations in Python, however there were a few things I wanted in a circuit breaker implementation that I couldn't seem to find. First, I wanted to detect errors in return values without raising exceptions and second I wanted to experiment with different strategies for determining the breaker status.

## Return Value Error Detection

I had a API gateway, written in Python, that passed requests off to the appropriate backend service. The key to any reasonable performance and memory usage is that the upstream responses are streamed back to the client rather than being read into memory and then resent.

![Displayed API Spec](/img/proxy_service.png)

The API gateway used the [requests](https://requests.readthedocs.io/en/master/) library and so an easy way to integrate it with an existing circuit breaker implementation would be to call `raise_for_status()` and catch the appropriate errors. However, this is not as straightforward as it may seem. When an upstream service returns a 4xx error code, it usually also includes some kind of message to the client to help them solve the error. For example, when a POST API fails to validate a JSON body, the 400 response will include a human readable message indicating what the error was. The API gateway needs to continue to return that message which means that exceptions for 4xx responses need to be caught, the response read into memory, and then returned.

There is a better way to solve this specific case that I built into `pycircuitbreaker`. The `circuit` decorator is able to take an optional `detect_error` parameter than can inspect the return value and determine if it is an error. This makes it easy to integrate with return-oriented programming, and while slightly less pythonic, allows seemless integration with the codebase I was working on.

{{< highlight python3 >}}
from pycircuitbreaker import circuit

def detect_500(response) -> bool:
    return response.status_code == 500

@circuit(detect_error=detect_500)
def request():
    response = external_call()
    return response
{{< /highlight >}}

## Configurable Breaker Status Detection

Most circuit breaker implementations operate such that a sequential series of errors is required for the breaker to open. If the threshold is set to `5`, then once `5` errors have occured in a row the breaker opens. However, if the breaker starts closed, sees 4 errors and then 1 success, the breaker loses it's memory and resets the error counter to 0. 

When the upstream service the breaker is protecting is completely down and all requests fail, this strategy poses no problem. The breaker will quickly detect the errors and open allowing calls to the service to quickly fail.

But, if the service is degraded such that only 1/5 requests go through, there is potential that the breaker will never open. If the breaker sees the following pattern it will never open and we will not see any benefits to our system.

* 4 errors
* 1 success
* 4 errors
* 1 success

There is a simple fix that can handle this case. Rather than allowing a single success to reset the error count, successful requests decrement the error count subject to a minimum of 0.

{{< highlight python3 >}}
def on_success(self):
    self.error_count = max(0, self.error_count - 1)

def on_error(self):
    self.error_count += 1
{{< /highlight >}}

In the request pattern above, the breaker will function as follows:

* 4 sequential errors increments the count to 4
* 1 success decrements the count to 3
* 2 errors set the count to 5 and the breaker opens

This allows the breaker to easily detect degraded external services without much computational overhead.

## Next Steps

Going forward I want to expand `pycircuitbreaker` to support more complex detection and state management. At present, all of the breaker state is stored in memory which, while simple, does have downsides in multiprocess environments as extra failing requests will go through until the breakers in all processes open. I want to investigate using Redis to back the breaker state and allow sharing across processes & services.