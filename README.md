# mharj-etag-tools

Cache validation example with state (i.e. redux)
```typescript
const {todo} = getState();
const headers = new Headers();
if (haveETag(todo)) {
	headers.set('if-none-match', getETag(todo));
}
const res = await fetch('https://jsonplaceholder.typicode.com/todos/1', {headers});
if (res.status === 200) {
    const data = await res.json();
    const todoEtagObject = wrapEtag(data, getEtagHeader(res));
    dispatch(storeTodo(todoEtagObject));
}
```
