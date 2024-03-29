---
title: "Thoughts on Redux"
date: 2021-10-11T10:42:47-04:00
draft: false
tags: ["javascript", "react", "hooks", "redux"]
---

[Redux](https://redux.js.org/) is a state management library that is commonly used in React apps. Redux was created in 2015 and almost immediately became a common sight in React apps. This may have been due to the fact that many of the React docs assumed that Redux was installed along with the popularity of boilerplates that included Redux by default. As a result of this, many front-end developers including myself, incorrectly assumed that React had to be used with Redux. 

## Issues with Redux

There are a number of common problems with the way that Redux is used inside of large, complicated, React apps. I've run into each of these before and trying to correct them can take a lot of effort 

* Using too much global state
* Fully public state and sharing state between reducers
* Listening to Actions from Another Reducer and trying to infer what the user did

### Too Much / Inappropriate Global State

This is the most common problem I have encountered in large React + Redux applications. In this error mode, state that should be local to a component is hoisted into the global redux store so that the component becomes stateless. At first glance, this doesn't pose seem like much of a problem however as an application grows there becomes so many actions and state values that the state object becomes filled with one-off values that will never be shared with another component. Further, as more state is added to redux, handling of resetting state becomes more complex and can often be forgotten.

For example, consider a button in a modal component that triggers a file download. While the file is downloading, the save button needs to show a loading spinner and then afterwards the file is either downloaded or an error message is shown to the user stating that something went wront.

![Download Modal](/img/redux_modal.png)

The state here could be modeled with two properties: a boolean to determine when the download is running, and an optional error message.

```javascript
const state = {
  loading: false,
  error: null,
};
```

If this state is hoisted into a redux store for the page, it will be retained long after the modal that triggered the download action has been stopped being rendered. Care needs to be taken to ensure that in each case where the component is removed from the page, e.g. navigation, modal close, download success, that the reset action needs to be triggered. It is common to miss all of these cases leading to issues where the modal ishows stale data when used a second or third time.

### Fully Public State and Sharing State Between Action Creators

In redux stores, the entire state object is publicly available to action creators. An action creator is allowed to inspect the full state via a call to `getState()`. When an action creator does this, it usually this implies that the boundary of a reducer is wrong, however I have often seen `getState()` used anyway.

This is an issue because it can lead to situations where other reducers use state fields for reasons beyond their original intended use. This can lead to the introduction of subtle bugs if the reducer that owns the state changes an internal implementation. If we go back to the modal example from the previous section, suppose that a second module looks at the `error` field and considers only `null` values to be no error. If the reducer changes the implementation of the reset action such that the `error` field is reset to an empty string `''`, the second module will break in subtle ways.

### Listening to Actions from Another Reducer

By design, redux sends every action to every reducer and listening to actions from another reducer is an accepted and encouraged pattern. However I recommend using this sparingly because it can cause a complexity increase, particuarly when asynchronous streams are sending events that interact with each other. An additional concern is that the reducer that owns the action changes the implementation slightly causing breaking changes to downstream code.

To explore this, we're going to look at a reducer that listens to an action from another reducer and explore some of the downsides. The reducer is responsible for maintaining a list of the user's todos which are loaded when the user logs in.

```javascript
import { USER_LOGGED_OUT } from './auth';

const initialState = {
  loading: false,
  todos: []
}

function todoReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGGED_OUT:
      // On log-out, need to clear all the data from the previous user
      return initialState;
    case TODOS_LOADING:
      return { ...state, loading: true };
    case TODOS_LOAD_SUCCESS:
      return { ...state, loading: false, todos: action.todos };
    default:
      return state
  }
}
```

Now, let's consider what happens if a user logs in and then immediately logs out. The messages that get dispatched to the `todoReducer` could come in three different orders:

1. `TODOS_LOADING`, `TODOS_LOAD_SUCCESS`, `USER_LOGGED_OUT`
2. `TODOS_LOADING`, `USER_LOGGED_OUT`, `TODOS_LOAD_SUCCESS`
3. `USER_LOGGED_OUT`, `TODOS_LOADING`, `TODOS_LOAD_SUCCESS`

The code written above only correctly handles the first case. If either of the other two occur, the previous user's data will be loaded into state. The best solution to this problem would be to not dispatch the `TODOS` actions once the user has logged out, however that often requires the "Sharing State" pattern to be followed and can make the action creators complicated and unwieldly. It also means that every spot that could dispatch the `USER_LOGGED_OUT` event needs to be updated to cancel the appropriate requests.

Another risk is that the auth reducer starts listening to a new action, `USER_FORCED_LOGGED_OUT` to indicate a slightly different log out path. When that is added, the `todoReducer` could be missed and the data would not be cleared until the new action is also listened to.

## Modern Alternatives

In 2021, there are two great alternatives to Redux: local component state and react contexts. 

### Local State

The alternative to placing single-component state in Redux is to use local component state. Contrary to [popular belief](https://web.archive.org/web/20160320004555/https://www.safaribooksonline.com/blog/2015/10/29/react-local-component-state/) it is not actually harmful. It turns out that using local component state has some advantages:

1. Automatically resetting the state when the component leaves the page
2. Allows components to be placed multiple times in the page without state conflicts

If we go back to our modal example, the download modal look something like this

```tsx
import React, { useState } from 'react';

export const ModalContainer = () => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  return (
    <button
      disabled={downloading}
      onClick={async () => {
        // Run download
        setDownloading(true);

        try {
          // For the purposes of the example, assume these functions exist
          const data = await getData();
          saveFile('file.txt', data);
          setError(''); // If we had an error before, make sure the error state is cleared
        } catch err {
          setError('Failed to download file')
        }

        setDownloading(false);
      }}
    >
      Download File
    </button>
    {error && (
      <p className="error">{error}</p>
    )}
  )
};
```

### Global State

Global state represents application state that needs to be shared by two or more components. This is normally where redux excels, however the [React Context API](https://reactjs.org/docs/context.html) can provide a more modern equivalent that has some distinct advantages.

### Typescript Support

Since React contexts are written like any other JSX component, they can be easily written in Typescript without complicated typing or build tools. 

### Public APIs

Contexts can provide more than just a state value and I have often used this to provide public APIs for the data the context controls. For example, consider the context below that manages data around a list of users in an application.

```tsx
import React, { createContext, useEffect, useState, FunctionComponent } from 'react';

interface User {
  id: number;
  name: string;
}

interface UserContextState {
  getUser: (id: number) => User|undefined;
  getUsers: () => User[];
}

const defaultUserState = {
  getUser: (id: number) => undefined,
  getUsers: () => [],
};

export const UserContext = createContext<UserContextState>(defaultUserState);

export const UserContextProvider: FunctionComponent = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  userEffect(async () => {
    // On load, get users from the server and save them to the state
    // For the purposes of the example, assume we have a function that does this for us
    const newUsers = await getUsersFromServer();
    setUsers(newUsers);
  }, []);

  return (
    <UserContext.Provider
      value={{
        getUsers: () => users,
        getUser: (id: number) => users.find(user => user.id === id)
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
```

Because the context does not expose the `users` state directly, we are free to make internal changes to the context without breaking the public API. For example, the version here has an `O(n)` implementation of `getUser`. Instead, we could change the type of the `users` state from an array to a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and provide a different implementation of `getUsers` that still returned an array. This kind of flexibility can improve developer velocity and quickly allow changes to be made without needing to rewrite large portions of the application.

A downside of contexts can occur when multiple contexts need to depend on each other. This is easier in redux because the entire state is available to all reducers, but due to the fact that contexts are rendered as React components, circular dependencies are not allowed. In my experience, the best use of contexts is for state that is rather well isolated rather than for state that is highly dependent on other application state.

### State Change Management

I noted in the previous section that contexts were best used when state was well isolated, React contexts make it easier to understand the relationship between different pieces of state. Since we can use normal react component rendering rules, we don't need to care about the exact order in which actions occur, and instead only care about the final outcome. If we revisit the earlier example of users and todos and want to combine their state in some way, it's much easier to handle with contexts. This is a rather contrived example, and could have been implemented in many other ways, however I want to use it to show the power of contexts and dependency management.

```tsx
import React, { createContext, useContext } from 'react';

// Assume these exist and are both similar to the UserContext example that was previously shown
import { TodoContext, Todo } from './todos';
import { UserContext, User } from './users';

interface UserTodo {
  userID: number;
  userName: string;
  todoText: string;
  todoDate: date;
}

interface UserTodoContextState {
  getUserTodosForDate: (userID: number, date: Date) => UserTodo[];
}

const defaultContextState = {
  getUserTodosForDate: (userID: number, date: Date) => [],
};

export const UserContext = createContext<UserTodoContextState>(defaultContextState);

export const UserTodoContextProvider = ({ children }) => {
  const { getUser } = useContext(UserContext);
  const { getTodosForUser } = useContext(TodoContext);

  return (
    <UserContext.Provider
      value={{
        getUserTodosForDate: (userID: number, date: Date) => {
          const user = getUser(userID);
          const todos = getTodosForUser(userID, date);
          if (!user || !todos.length) {
            return [];
          }

          return todos.map(todo => ({
            userID,
            userName: user.name,
            todoText: todo.text,
            todoDate: todo.date,
          }))
        }
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
```

The beauty about the context based solution is that React will re-render the context provider whenever the `UserContext` or `TodoContext` change. Now, we don't have to deal with understanding why the data changed, just that it did. If either of the contexts are refactored, the `UserTodoContext` will still work without changes.

### Revisiting Listening to Actions from Another Reducer

Earlier, I showed the example of how a `USER_LOGGED_OUT` action could interact with two other actions that were loading the user's todo list. Let's explore how this could be made a lot simpler with contexts.

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// Assume this exists and provides some info about if the user is logged in or not
import { AuthContext } from './auth';

interface Todo {
  date: Date;
  text: string;
}

interface UserTodoContextState {
  getUserTodosForDate: (userID: number, date: Date) => UserTodo[];
}

const defaultContextState = {
  todos: Todo[];
};

export const TodoContext = createContext<TodoContext>(defaultContextState);

export const TodoContextProvider = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const { isLoggedIn, userID } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      // User has logged in, so we need to load the todos
      const controller = new AbortController();

      const fetchTodos = async () => {
        try {
          await fetch(`http://example.com/api/todos/${userID}`, { signal: controller.signal });
        } catch {
          setTodos([]);
        }
      };

      // We don't await this because we want it to run async
      fetchTodos();

      // Cleanup function that will abort the fetch request.
      // React will call this if the effect runs again which will happen
      // if `isLoggedIn` transition from true to false
      return () => controller.abort()
    } else {
      // User has logged out, clear the todo list
      setTodos([]);
    }
  }, [isLoggedIn, userID])

  return (
    <TodoContext.Provider
      value={{
        todos,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}
```

This context is quite simple and yet provides a lot of functionality. Todos are automatically loaded when the user is logged in and once the user logs out, the todos are cleared. It doesn't matter how the user came to be logged out, just that they were which makes understanding this code easier.

## Closing Thoughts

While Redux in 2021 is still a good solution for state that needs to be shared across an entire application, new development should strongly consider using React contexts as they allow exposing an API to consumers, they are easily written in Typescript, and dependency management via React makes understanding the relationship between data simpler and clearer.
