# mharj-etag-tools

## Simple ETag object setup to store and handle both data and ETag value.

### Install

```bash
npm i mharj-etag-tools
```

### Object Shape

```typescript
interface IEtagObject<T = unknown> {
	readonly etag: string | null;
	readonly data: T;
}
```

### Example

Cache validation example with state (i.e. redux)

```typescript
const todo = getState().todo; // IEtagObject<PlaceholderObjectType | undefined>
const headers = new Headers();
if (haveETag(todo)) { // Checks if todo is IWithEtagObject type (has actual ETag value)
	headers.set('if-none-match', getETag(todo)); // Attaches ETag header from last state
}
const res = await fetch('https://jsonplaceholder.typicode.com/todos/1', {headers});
if (res.status === 200) {
	const data = await res.json();
	const todoEtagObject = wrapEtag(data, getEtagHeader(res));
	dispatch(storeTodo(todoEtagObject)); // updates IEtagObject<PlaceholderObjectType> to state
}
if (res.status === 304) {
	// do nothing as state is already up to date
}
```
