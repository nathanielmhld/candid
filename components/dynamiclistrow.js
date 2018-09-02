import React, {
  Component
} from "react";
import {View, Text, StyleSheet, CameraRoll, AsyncStorage, TouchableOpacity,
  ImageBackground, Image, ScrollView, FlatList, Dimensions, Animated
} from "react-native";

export default class DynamicListRow extends Component {
   // these values will need to be fixed either within the component or sent through props
   _defaultHeightValue = 60;
   _defaultTransition  = 500;
   state = {
       _rowHeight  : new Animated.Value(this._defaultHeightValue),
       _rowOpacity : new Animated.Value(0)
   };
   componentDidMount() {
       Animated.timing(this.state._rowOpacity, {
           toValue  : 1,
           duration : this._defaultTransition
       }).start()
   }
   /*
This method will fire when the component receives new props or the props change on the 
component, if you check the renderRow method, you will see that there’s a remove 
property that is changing every time the state changes
( remove={rowData.id === this.state.rowToDelete} )
*/
componentWillReceiveProps(nextProps) {
   if (nextProps.remove) {
       this.onRemoving(nextProps.onRemoving);
   } else {
       this.resetHeight()
   }
}

/*
Will animate the removal process, transitioning the height
*/
onRemoving(callback) {
   Animated.timing(this.state._rowHeight, {
       toValue  : 0,
       duration : this._defaultTransition
   }).start(callback);
}
/*
Will reset the row height to the initial value. We need this because when we remove a row, 
its height goes to 0 and when we actually remove it from the dataSource right after and 
will fire re-rendering process, the row component does not “reset” on iOS, only the data 
will change within rows, so we end up by seeing 2 fields go out if we don’t call this.
*/
resetHeight() {
   Animated.timing(this.state._rowHeight, {
       toValue  : this._defaultHeightValue,
       duration : 0
   }).start();
}
   render() {
       return (
           <Animated.View
               style={{height: this.state._rowHeight, opacity: this.state._rowOpacity}}>
               {this.props.children}
           </Animated.View>
       );
   }
}
