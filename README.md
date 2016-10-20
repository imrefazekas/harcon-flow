Harcon-flow is a simple utility library aiming to leverage a very simple syntax to define microtransaction between entities.



#### General structure

```javascript
['->'] actor [ ':' message ] control_flow
	actor : message
	// more actor : message lines
```

The first optional mark signs that the given actor is initiated from a REST or websocket call. That will make the actor implicitly a REST-, and Websocket-compliant.
Then you define the name of the actor, the message its receives and the flow control it represents and finally all the messages it sends out.



#### Control flow

That defines how the first actor wants to send messages out.

- ->: series. Sends out the messages in order sequentially
- =>: waterfall. Sends out the messages in order sending the result of a call to the next one
- >>: spread. It sends out all messages in parallel



#### Naming conventions

The following contention is highly proposed to follow:
- actor: starts with upper case letter followed by lower case letters
- message: all lower case letters



#### Interfaces

You can mark if an entity provides an interface to the outside-world with the following symbols:

- <>: websocket
- []: rest
- {}: websocket and rest
- (): web pages

One of the signs can be places before any actors in the definition as follows:

```javascript
-> {}B : perform =>
	 <>C : do
```



#### Comments

You can have comment-lines started with __'#'__ or comments at the end of other lines startd with __'//'__

```javascript
# general command line
-> B : perform => // some message received
	 C : do
```



## License

(The MIT License)

Copyright (c) 2016 Imre Fazekas

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


## Bugs

See <https://github.com/imrefazekas/harcon-flw/issues>.