

import React, {
  Component
} from "react";
import {View, Text, StyleSheet, CameraRoll, AsyncStorage, TouchableOpacity,
  ImageBackground, Image, ScrollView, FlatList, Dimensions, Animated, InteractionManager, ListView
} from "react-native";



import DynamicListRow from './dynamiclistrow';

export default class DynamicList extends Component {
   /* Default state values */
   state = {
       loading     : true,
       dataSource  : new ListView.DataSource({
           rowHasChanged : (row1, row2) => true /*  It is important for this to be 
always true so that the renderRow fires every time we update the dataSource and we set 
the state without needing to have different items added/removed or updated to the list 
view */
       }),
       refreshing  : false,
       rowToDelete : null /* this will keep the id of the item to track if will need 
to be animated and removed afterwards */
   };
/* Loading data after interactions are done will ensure that the transitions and other 
activity regarding view rendering has already happened and this is important especially 
when this is the first View that renders */

   componentDidMount() {
       InteractionManager.runAfterInteractions(() =>  this._loadData() ); 
   }

   _loadData(){
    console.log(this.props.data)
    console.log(JSON.parse(this.props.data))
    this.setState({dataSource:
    this.state.dataSource.cloneWithRows(JSON.parse(this.props.data))
    });
   }
/* … other methods … */

/* 
Render a simple ListView. Normally at this point you would have to check on loading 
state and display a spinner while data loads async from the server, but in this case 
is not needed as we’re loading everything from a simple local JSON file.
I have bound the scope of this component to _renderRow method to keep it in this 
component’s scope and avoid switching the scope to ListView as renderRow is an internal 
property in ListView.
 */
render() {
       return (
           
               <ListView
                    dataSource={this.state.dataSource}
                   renderRow={this._renderRow.bind(this)}
               />
       );
   }
/*
For rendering the list rows we will use DynamicListRow component. 
The remove property will be responsible for firing the collapse animation of the 
removal process within DynamicListRow component.
onRemoving  is going to be fired by the component when the animation transition ends 
and we will attach _onAfterRemovingElement() which is bound in the current scope as well.
 */
_renderRow(item, rowID) {
  console.log("WOWOWOW")
   return (
       <DynamicListRow
           remove={item.id === this.state.rowToDelete}
           onRemoving={this._onAfterRemovingElement.bind(this)}
       >
         <TouchableOpacity onPress={(e) => {this.sendPicture(item);}}>
            <Image source={{ uri: item.photo}} style={{width: Dimensions.get('window').width/3, height: (item.height/item.width)*Dimensions.get('window').width/3}}/>
          </TouchableOpacity>
       </DynamicListRow>
   );
}




/* deleteItem() only sets the property rowToDelete on the state to distinguish the 
one that has to be deleted */
_deleteItem(id) {
   this.setState({
       rowToDelete : id
   });
}

/* Setting the state will fire the re-rendering process and componentWillUpdate will 
fire as well. This function is called on the callback of the animation so that it 
only updates the dataSource with the cached data when the delete animation is done */
_onAfterRemovingElement() {
   this.setState({
       rowToDelete : null,
       dataSource  : this.state.dataSource.cloneWithRows(this._data)
   });
}
/* When the state is changed componentWillUpdate fires and will update the cached 
data we need to render on the list view */
componentWillUpdate(nextProps, nextState) {
   if (nextState.rowToDelete !== null) {
       this._data = this._data.filter((item) => {
           if (item.id !== nextState.rowToDelete) {
               return item;
           }
       });
   }
}
}