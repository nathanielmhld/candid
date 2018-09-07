import React, { Component } from 'react';
import {
  ActionSheetIOS,
  CameraRoll,
  ScrollView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
  AsyncStorage,
  Animated
} from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Container, Content, Icon, Header, Left, Body, Right, Segment, Button } from 'native-base'
import { API, Storage } from 'aws-amplify';

export default class ImageTile extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectanimation: new Animated.Value(1),
      arrowanimation: new Animated.Value(0),
      sendanimation: new Animated.Value(0),
      selected: false,
      sent: false
    };
    this.imageTapped = this.imageTapped.bind(this);
    this.imageUnSelected = this.imageUnSelected.bind(this);
  }
  imageTapped(){
    console.log("Tapped")
    if(this.state.selected){
      Animated.spring(
      // Uses easing functions
      this.state.sendanimation, // The value to drive
      {toValue: 0,
      friction: 10} // Configuration
      ).start();
      Animated.timing(
      // Uses easing functions
      this.state.selectanimation, // The value to drive
      {toValue: 0} // Configuration
      ).start();
      Animated.timing(
      // Uses easing functions
      this.state.arrowanimation, // The value to drive
      {toValue: 0} // Configuration
    ).start();
      this.props.parentSelect(null);
      this.setState({sent: true});
      this.props.action(this.props.item);
    }else if(this.props.parentSelect(this.imageUnSelected)){
      Animated.timing(
      // Uses easing functions
      this.state.selectanimation, // The value to drive
      {toValue: .5} // Configuration
    ).start()
      Animated.timing(
      // Uses easing functions
      this.state.arrowanimation, // The value to drive
      {toValue: 1} // Configuration
    ).start()
    this.setState({selected: true})
    }
  }

  componentDidMount(){
    Animated.timing(
      // Uses easing functions
      this.state.sendanimation, // The value to drive
      {duration: 500,
      toValue: (this.props.item.height/this.props.item.width)*Dimensions.get('window').width/3} // Configuration
      ).start();
  }
    
  imageUnSelected(){
    console.log("UnSelected")
     Animated.timing(
      // Uses easing functions
      this.state.selectanimation, // The value to drive
      {toValue: 1} // Configuration
    ).start()
      Animated.timing(
      // Uses easing functions
      this.state.arrowanimation, // The value to drive
      {toValue: 0} // Configuration
    ).start()
    this.setState({selected: false})
  }
  imageSent(){
    console.log("Sent")
    this.setState({selected: false})
  }

  render(){
      return(
      <TouchableWithoutFeedback onPress={this.imageTapped}>
        <View>
        <Animated.View style={{opacity: this.state.arrowanimation, width: Dimensions.get('window').width/3, height: this.state.sendanimation, position: "absolute", alignItems:'center', justifyContent: "center"}}>
          <Entypo name={this.props.icon} style={{color:'black', fontSize: 60, zIndex: 2}}/>
        </Animated.View>
        <Animated.View style={{opacity: this.state.selectanimation, height: this.state.sendanimation}}>
          <Image source={{ uri: this.props.item.photo}} style={{width: Dimensions.get('window').width/3, height: (this.props.item.height/this.props.item.width)*Dimensions.get('window').width/3}}/>
        </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      )
  }
}