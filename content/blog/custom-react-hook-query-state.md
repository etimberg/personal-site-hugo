---
title: "A Simple Custom React Hook to Keep State in Query String"
date: 2020-07-01T10:27:00-04:00
tags: ["javascript", "react", "hooks"]
---
A common problem with many web apps is that it is not easy to share links to another user. This is usually due to the fact that the transient page state is only stored in memory. 

I ran into this recently with a page in an app that allowed the user to view a parameter over time. The filter parameters (`id`, `startTime`, and `endTime`) were all stored in the component state and so if the user refreshed the page, all of the previous selection was lost. Fortunately, there is a simple solution: place the parameter values in the [query string](https://en.wikipedia.org/wiki/Query_string).

After implementing this on a couple of routes, I was able to find a common pattern and factor the logic out into a custom hook. The hook is a replacement for React's own `useState` hook. It serializes the value and updates the query string whenever the value is changed. The hook does not read the initial value from the query string since I wanted to keep it as close to the original `useState` API as possible.

## Implementation

{{< highlight typescript >}}
import qs from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export default function useQueryState<S>(
  initialState: S | (() => S),
  paramName: string,
  serialize: ((val: S) => string) | undefined = undefined,
): [S, React.Dispatch<React.SetStateAction<S>>] {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const queryParams = useMemo(() => qs.parse(search), [search]);

  const [stateValue, setState] = useState<S>(initialState);

  useEffect(() => {
    const serializedValue = serialize ? serialize(stateValue) : stateValue !== null ? String(stateValue) : null;

    // To avoid infinite loops caused by history.replace (which triggers the history object to change)
    // Check to see if our tag is going to change and only update the query param if that is true
    if (queryParams[paramName] !== serializedValue) {
      const updatedQueryParams = {
        ...queryParams,
      };

      if (serializedValue !== null && typeof serializedValue !== 'undefined') {
        updatedQueryParams[paramName] = serializedValue;
      } else {
        delete updatedQueryParams[paramName];
      }
  
      const newURL = qs.stringifyUrl({
        url: pathname,
        query: updatedQueryParams,
      });
  
      history.replace(newURL);
    }
  }, [stateValue, history, paramName, pathname, queryParams, serialize])

  return [stateValue, setState];
};

{{< /highlight >}}

## Serializing Complex Values

The 3rd parameter to the `useQueryState` hook allows for custom serialization of complex values. I used this to serialize [Luxon](https://moment.github.io/luxon/) `DateTime` objects. When selecting a date only, the time component doesn't matter so we can serialize to a `YYYY-MM-DD` format by passing the function below as the serializer.

{{< highlight typescript >}}
function serializeDate(date: DateTime) {
  return date.toISODate();
};

{{< /highlight >}}

## Usage

Now, we can put it all together. Let's say we have some local state for a selected `id` and want that to appear in the query string as `?id=<value>`. All we need to do is replace `useState` with `useQueryState` and specify the parameter name we want to use.

{{< highlight typescript >}}
import React from 'react';

const OurComponent = () => {
  // As the ID state changes, the query string will automatically update
  // When the value is null, nothing is added to the query string
  const [id, setID] = useQueryState<string|null>(null, 'id');

  ...
};
{{< /highlight >}}

## Future Improvements

The use of `query-string` can likely be replaced with [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) though I haven't yet tested that. I already had `query-string` in my project, so it's use didn't cost anything and it supports IE11.
