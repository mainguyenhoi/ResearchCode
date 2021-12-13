# Project Vj
tìm hiểu câus trúc, luồng
trách nhiệm của các folder
sau đó nắm quy tắc design container, component, style css, responsive
xem luồng hoạt động của các bước booking
javascript, jquery, DOM
interface vs abstract class 
Life cycle react

quy tắc : container là stateful, component là stateless

Routes
	|
	|--nếu có kiểm tra(checkLogin, checkBookingForm)-HOCs : kiểm tra đúng trả về đg dẫn props, |-- chạy tới component được chỉ định. Containers: dispatch ở đây, hiện thị nội dung | --Bọc layout cho nội dung: HOCs(tổng hợp nôi dung)
							 	sai trả về RedirectComponent
							 											     |
																		     |action ở store--Types-- actionType |-- saga : store		
																			

note: useInjectReducer

# Các file trong Project VJ 
1 pages thì bao gồm các cp vs container
Container có thể gồm nhiều cp và cp cũng có thể có nhiều container
Component là stateless
Container là statefull

# ************************************************************************

 # React
##	| -Khởi tạo class đã kế thừa từ Component
	|
##	|-Khởi tạo giá trị mặc định cho Props
	|
##	|-Khởi tạo giá trị mặc định cho State
	|
##	|-Gọi hàm componentWillMount()
	|
##	|-Gọi hàm render()------------------------------|-Nếu props, state thay đổi -> render() |-> Nếu trong component tồn 																					tại hàm callback, hàm sẽ được
	|												đánh giá lại(useMemo để khắc phục)
	|																	
	|						
##	|												|-> Nếu trong cp tồn tại cp con có chứa gọi hàm, 
	|												hàm này sẽ được tạo lại(useCallBack để khắc phục)
	|																	
	|							
##	|-useEffect()|Sau khi render() hoàn thành chạy hàm useEffect()
	|		(Khắc phục: Mutations, subscriptions, timers, logging, và các side effects không được phép sử dụng bên 				trong body của function component)
	|
	|-Gọi hàm componentDidMount()


# useMemo: 
		Giữ cho một hàm không được thực thi lại nếu nó không nhận được một tập hợp các tham số đã được sử dụng trước đó. Nó sẽ trả về kết quả của một function. Sử dụng nó khi bạn muốn ngăn một số thao tác nặng hoặc tốn kém tài nguyên được gọi trên mỗi lần render.

		Mặt hại: Chỉ dùng useMemo khi thất sự phải ngăn chặn gọi lại của một hàm tiêu tốn nhiều tài nguyên hoặc cần nhiều thời gian. 
		Tại sao ? Bởi vì useMemo lưu trữ các kết quả của việc thực thi hàm vào bộ nhớ, điều này có thể sẽ lớn dần lên và không may nó lại làm giảm hiệu suất ứng dụng của bạn.
# useCallback: 
		Giữ cho một hàm không được tạo lại lần nữa, dựa trên mảng các phần phụ thuộc. Nó sẽ trả về chính function đó. Sử dụng nó khi mà bạn muốn truyền fuction vào component con và chặn không cho một hàm nào đó tiêu thời gian, tài nguyên phải tạo lại.

		Mặt hại:
		Khi không dùng useCallback thì version cũ của hàm sẽ được thu gom lại, nhưng nếu dùng useCallback nó sẽ được giữ lại ở trong bộ nhớ, trong trường hợp một trong các phần phụ thuộc sẽ hoạt động đúng trở lại để trả về version cũ của hàm đó.

		 Vậy khi nào nên dùng useCallback ? Khi mà bạn cảm thâý thật sự không dùng nó thì hiệu suất của ứng dụng của bạn  sẽ rất tồi tệ hoặc kết quả của việc thực thi một hàm không cần thiết. (ví dụ như gọi một API).

# ---------------------------------------------------------------------

# invariant(condition, message)
		var invariant = require('invariant');
 
#		invariant(someTruthyVal, 'This will not throw');
		// No errors
 
#		invariant(someFalseyVal, 'This will throw an error with this message');
		// Error: Invariant Violation: This will throw an error with this message

# ---------------------------------------------------------------------

# Reflect.has() The static Reflect.has() method works like the in operator as a function.
#	const object1 = {
#  		property1: 42
#	};

# console.log(Reflect.has(object1, 'property1'));
// expected output: true

# console.log(Reflect.has(object1, 'property2'));
// expected output: false

# console.log(Reflect.has(object1, 'toString'));
// expected output: true

# ---------------------------------------------------------------------

# The in operator returns true if the specified property is in the specified object or its prototype chain.
#		const car = { make: 'Honda', model: 'Accord', year: 1998 };

#		console.log('make' in car);
		// expected output: true

#		delete car.make;
#       if ('make' in car === false) {
#  			car.make = 'Suzuki';
#    	}

console.log(car.make);
// expected output: "Suzuki"

# ---------------------------------------------------------------------

#	Using replaceReducer​
The Redux store exposes a replaceReducer function, which replaces the current active root reducer function with a new root reducer function. Calling it will swap the internal reducer function reference, and dispatch an action to help any newly-added slice reducers initialize themselves:

const newRootReducer = combineReducers({
  existingSlice: existingSliceReducer,
  newSlice: newSliceReducer
})

store.replaceReducer(newRootReducer)

# ---------------------------------------------------------------------

# Responsive



# React Lifecycle 
# -- Mounting
	Mounting means putting elements into the DOM
	React has four built-in methods that gets called, in this order, when mounting a component:
#	1. constructor()
		method is called before anything else, when the component is initiated, and it is the natural place to set up the initial state and other initial values.
#	2. getDerivedStateFromProps()
		This is the natural place to set the state object based on the initial props.

		It takes state as an argument, and returns an object with changes to the state
#	3. render()
		method is required, and is the method that actually outputs the HTML to the DOM.
#	4. componentDidMount
		method is called after the component is rendered.
		This is where you run statements that requires that the component is already placed in the DOM.

		componentDidMount() is a hook that gets invoked right after a React component has been mounted aka after the first render() lifecycle.

		componentDidMount() is invoked immediately after a component is mounted (inserted into the tree). Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request.

		ex:
		class App extends React.Component {

  componentDidMount() {
    // Runs after the first render() lifecycle
  }

  render() {
    console.log('Render lifecycle')
    return <h1>Hello</h1>;
  }
}

		Here’s an example with a functional component.
### Note : The render() method is required and will always be called, the others are optional and will be called if you define them.

# -- Updating
The next phase in the lifecycle is when a component is updated.
A component is updated whenever there is a change in the component's state or props.
React has five built-in methods that gets called, in this order, when a component is updated:

# 	1. getDerivedStateFromProps()
		Also at updates the getDerivedStateFromProps method is called. This is the first method that is called when a component gets updated.

		This is still the natural place to set the state object based on the initial props.
#   2. shouldComponentUpdate()
		In the shouldComponentUpdate() method you can return a Boolean value that specifies whether React should continue with the rendering or not.
		The default value is true.
# 	3. render()
		The render() method is of course called when a component gets updated, it has to re-render the HTML to the DOM, with the new changes.
# 	4. getSnapshotBeforeUpdate()
		In the getSnapshotBeforeUpdate() method you have access to the props and state before the update, meaning that even after the update, you can check what the values were before the update.

		If the getSnapshotBeforeUpdate() method is present, you should also include the componentDidUpdate() method, otherwise you will get an error.
#	5. componentDidUpdate()
		The componentDidUpdate method is called after the component is updated in the DOM.

### Note: The render() method is required and will always be called, the others are optional and will be called if you define them.

# --Unmounting
	The next phase in the lifecycle is when a component is removed from the DOM, or unmounting as React likes to call it.
	React has only one built-in method that gets called when a component is unmounted:
#	componentWillUnmount()
	The componentWillUnmount method is called when the component is about to be removed from the DOM.

# Redux concept and flow

# 	State Management
	It is a self-contained app with the following parts:

		The state, the source of truth that drives our app;

		The view, a declarative description of the UI based on the current state

		The actions, the events that occur in the app based on user input, and trigger updates in the state

# 	Immutability
		In order to update values immutably, your code must make copies of existing objects/arrays, and then modify the copies.
#   Redux expects that all state updates are done immutably

# 	Actions
		An action is a plain JavaScript object that has a type field. You can think of an action as an event that describes something that happened in the application.

		The type field should be a string that gives this action a descriptive name, like "todos/todoAdded"

		An action object can have other fields with additional information about what happened. By convention, we put that information in a field called payload.

		A typical action object might look like this:

		const addTodoAction = {
  			type: 'todos/todoAdded',
  			payload: 'Buy milk'
		}

#	Reducers
		A reducer is a function that receives the current state and an action object, decides how to update the state if necessary, and returns the new state: (state, action) => newState.

#		You can think of a reducer as an event listener which 			handles events based on the received action (event) type.

#	Reducers must always follow some specific rules:

	They should only calculate the new state value based on the state and action arguments

	They are not allowed to modify the existing state. Instead, they must make immutable updates, by copying the existing state and making changes to the copied values.

	They must not do any asynchronous logic, calculate random values, or cause other "side effects"

The logic inside reducer functions typically follows the same series of steps:

Check to see if the reducer cares about this action

	If so, make a copy of the state, update the copy with new values, and return it

Otherwise, return the existing state unchanged

#	Store

	The current Redux application state lives in an object called the store .

	The store is created by passing in a reducer, and has a method called getState that returns the current state value:

#	Dispatch

	The Redux store has a method called dispatch

#	The only way to update the state is to call store.dispatch() 	and pass in an action object

	The store will run its reducer function and save the new state value inside, and we can call getState() to retrieve the updated value

	You can think of dispatching actions as "triggering an event" in the application. Something happened, and we want the store to know about it. Reducers act like event listeners, and when they hear an action they are interested in, they update the state in response.

#	Selectors​

	Selectors are functions that know how to extract specific pieces of information from a store state value. As an application grows bigger, this can help avoid repeating logic as different parts of the app need to read the same data:

### Redux Application Data Flow
For Redux specifically, we can break these steps into more detail:

# 	Initial setup:

		A Redux store is created using a root reducer function

		The store calls the root reducer once, and saves the return value as its initial state

		When the UI is first rendered, UI components access the current state of the Redux store, and use that data to decide what to render. They also subscribe to any future store updates so they can know if the state has changed.

#	Updates:

		Something happens in the app, such as a user clicking a button
		The app code dispatches an action to the Redux store, like dispatch({type: 'counter/incremented'})

		The store runs the reducer function again with the previous state and the current action, and saves the return value as the new state

		The store notifies all parts of the UI that are subscribed that the store has been updated

		Each UI component that needs data from the store checks to see if the parts of the state they need have changed.

		Each component that sees its data has changed forces a re-render with the new data, so it can update what's shown on the screen

#	Middleware

#	Redux middleware provides a third-party extension point 		between dispatching an action, and the moment it reaches the 	 reducer. 

	 People use Redux middleware for logging, crash reporting, talking to an asynchronous API, routing, and more.
	
# mapStateToProps - dùng để map State của Component với State trong Store của Redux
# mapDispatchToProps - dùng để map method của Component với lời gọi action từ Store tới Actions của Redux
#  The most important concept to understand here is that the state in Redux comes from reducers. Let’s repeat: reducers produce the state of your application.

# A Redux reducer is just a JavaScript function. It takes two parameters: the current state and action

## Now the initial state is left pristine and the resulting state is just a copy of the initial state. Remember two key points for avoiding mutations in Redux:

	use concat, slice, or the spread operator for arrays
	use Object.assign or object spread of objects