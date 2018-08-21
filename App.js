import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage, Image } from 'react-native';
import {Permissions, Notifications} from 'expo';
import {Container, Content} from 'native-base';
import Swiper from 'react-native-swiper';

import CameraComponent from './components/camera';

import ConfigCamera from './components/configcamera';
import MediaComponent from './components/media';
import SignUpProcess from './components/signup'
import SignInProcess from './components/signin'
import Amplify, { API } from 'aws-amplify';

import aws_exports from './aws-exports';


const styles = StyleSheet.create({
  slideDefault:{
    flex: 1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#9DD6EB"
  },
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})
export default class App extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      hasDefault: false,
      isLoggedIn: false,
      signUp: false,
      loaded: false,
      notification: {},
    }
    this.configure = this.configure.bind(this);
    this.reconfigure = this.reconfigure.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.needToSignUp = this.needToSignUp.bind(this);
    this.signOut = this.signOut.bind(this);


    Amplify.configure(aws_exports);
  }
  authenticate(isAuthenticated) {
    console.log('setting authentication to true');
    this.setState({ isLoggedIn: isAuthenticated});
    this.registerForPush();
  }

  needToSignUp(signUp) {
    console.log('we need to sign up');
    this.setState({ signUp: signUp});
  }

  async signOut() {
    AsyncStorage.removeItem('user');
    this.setState({isLoggedIn: false});
    console.log("sign out");
  }

  async registerForPush(){
    notificationresponse = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(notificationresponse)
    if(notificationresponse){
      //this._notificationSubscription = Notifications.addListener(this._handleNotification);
      value = await AsyncStorage.getItem('user');
      let userId = JSON.parse(value)["username"];

      token = await Notifications.getExpoPushTokenAsync();
      let newNote = {
      body: {
        "username": userId,
       "token": token
     }
    }
    console.log(newNote);
    const path = "/tokens";
    API.put("CandidTokenHandler", path, newNote).then(apiResponse => {
      console.log(apiResponse);
    });
  }
}

  async componentDidMount(){
    this.setState({loaded: false});


    let value = await AsyncStorage.getItem('hasDefault');
    this.setState({hasDefault: value});
    console.log(value);
    value = await AsyncStorage.getItem('user');
    if (value){
      this.setState({isLoggedIn: true});
      this.setState({loaded: true});
      this.registerForPush();
    }else{
      this.setState({loaded: true});
    }
    
  }

  async reconfigure(){
    await AsyncStorage.removeItem('hasDefault');
    this.setState({hasDefault: false})

  }
  async configure(){
    const value = await AsyncStorage.getItem('hasDefault');
    this.setState({hasDefault: value});

  }
  render() {
    if(!this.state.loaded)
      return(<View/>);
    if(this.state.signUp) {
      console.log('signup is true');
      return (
        <SignUpProcess signUpAuth={this.needToSignUp}> </SignUpProcess>
      )
    }
    if(!this.state.isLoggedIn) {
      console.log('not logged in is true');
      return (
        <SignInProcess signInAuth={this.authenticate} signUpAuth={this.needToSignUp}> </SignInProcess>
      )
    }

    const {hasDefault} = this.state
    if(hasDefault){
      return (
        <Swiper ref='swiper' loop={false} showsPagination={false} index={0} removeClippedSubviews={true}>
        <View style={{flex: 1}}>
          <CameraComponent configure={this.reconfigure} signout={this.signOut}>
          </CameraComponent>
        </View>
        <View style={{flex: 1}}>
          <MediaComponent>
          </MediaComponent>

        </View>

      </Swiper>
      );
    }else{

      return (
      <View style={{flex: 1}}>
          <ConfigCamera method={this.configure}> </ConfigCamera>
        </View>
        );
    }
  }
}
