Harcon-flow is a simple utility library aiming to leverage a very simple syntax to define microtransaction between entities.



#### Installation

$ npm install harcon-flow


#### Quick setup

```javascript
var flow = require('harcon-flow')
flow.generateDefs( [ { name: '', def: 'some flow def' ] )
.then( (flows) => {
	console.log( flows.defs )
} )
```

This is an easy way to convert flow definitions into [harcon](https://github.com/imrefazekas/harcon)-specific Bender flow.

The following section tries to formalise the structure of flow defitions.


#### Flow definitions

```javascript
['->'] actor [ ':' message ] control_flow
	message
	// another message
```

The first optional mark signs that the given actor is initiated from a REST or websocket call.
That will make the actor implicitly a REST-, and Websocket-compliant.
Then you define the name of the actor, the message its receives and the type of the [flow control](#control_flow) it represents and finally all the messages it sends out.

message:

```javascript
'[' workflow name ']'
or
['*'] [domain '|'] [ interface ] actor : message
```

The optional '*' sign means, that the result of the flow's main actor will be interpreted as array and for all elements that given message will be sent to as a bulk operation.

Domain and interface specifications are optional. These information should be defined here only if no Flow definition exists assosiated to the given actor.


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

One of those signs can be places before any actors in the definition as follows:

```javascript
-> {}B : perform =>
	 <>C : do
```


#### Links

When a multiple flows are defined and passed to [harcon-flow](https://github.com/imrefazekas/harcon-flow), you are allowed to refer a flow from another as below:

```javascript
// bDef file:
-> B : perform =>
	 [C goes nuts]
...
// cDef file:
C : do =>
 	 D : act
	 E : urge
	 F : move
...
flow.generateDefs( [ { name: 'Client sends in data', def: bDef }, { name: 'C goes nuts', def: cDef } ] )
.then( (flows) { ... } )
```


#### Graph export

Pass an optional object to the function __generateDefs__ to force [harcon-flow](https://github.com/imrefazekas/harcon-flow) to generate graph representation of the flows as below:

```javascript
flow.generateDefs( [ { name: 'Client sends in data', def: bDef }, { name: 'C goes nuts', def: cDef } ], { d3: true } )
```

The current version supports [D3](https://d3js.org) only.



#### Comments

You can have comment-lines started with __'#'__ or comments at the end of other lines startd with __'//'__

```javascript
# general command line
-> B : perform => // some message received
	 C : do
```


#### Domains

You might want to add domains to your flows by adding '|' before your entities as below:

```javascript
Dom | C : send
```


#### Example

```javascript
# internal activity
{}B:greetings => // waterfall
	 C : do
	 D : act
	 <>E : manage
	 ()C : care
 ```

The entity __'B'__ will eventually perform its service 'greetings' which will send out messages to entities _'C', 'D', 'E' and 'C'__ in that order sending the result of a given call to the next actor, as waterfall model works.



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
