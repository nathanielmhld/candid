import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, AsyncStorage, Image } from 'react-native';
import {Permissions, Notifications} from 'expo';
import {Container, Content} from 'native-base';
import Swiper from 'react-native-swiper';

import ConfigCamera from './components/configcamera';
import MediaComponent from './components/media';
import SignUpProcess from './components/signup'
import SignInProcess from './components/signin'
import Homepage from './components/homepage'
import Browser from './components/browser';
import SettingPage from './components/settings';
import Amplify, { API } from 'aws-amplify';

import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

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
      isLoggedInNEW: false,
      signUp: false,
      loaded: false,
      swipe: false,
      seeLogInPage: false,
      seeSignUpPage: false,
      page: ''
    }
    this.configure = this.configure.bind(this);
    this.reconfigure = this.reconfigure.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.needToSignUp = this.needToSignUp.bind(this);
    this.signOut = this.signOut.bind(this);
	 this.navigate = this.navigate.bind(this);
    this.logInPage = this.logInPage.bind(this);
    this.signUpPage = this.signUpPage.bind(this);
    this.homePage = this.homePage.bind(this);
  }

  logInPage(value) {
    this.setState({ seeLogInPage: value, seeSignUpPage: !value});
  }

  signUpPage(value) {
    this.setState({ seeLogInPage: !value, seeSignUpPage: value});
  }

  homePage() {
    this.setState({ seeLogInPage: false, seeSignUpPage: false, isLoggedInNEW: false});
  }

  authenticate(isAuthenticated) {
    console.log('setting authentication to true');
    this.setState({ seeLogInPage: false, seeSignUpPage: false, isLoggedInNEW: true, isLoggedIn: isAuthenticated});
    this.registerForPush();
  }

  needToSignUp(signUp) {
    console.log('we need to sign up');
    this.setState({ signUp: signUp});
  }

  async signOut() {
    AsyncStorage.removeItem('hasDefault');
    AsyncStorage.removeItem('user');
    this.setState({ seeLogInPage: false, seeSignUpPage: false, isLoggedInNEW: false, isLoggedIn: false});
    console.log("sign out");
  }

  async registerForPush(){
    notificationresponse = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    console.log(notificationresponse)
    if(notificationresponse){
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
      this.setState({ seeLogInPage: false, seeSignUpPage: false, isLoggedInNEW: true});
      this.setState({loaded: true});
      this.registerForPush();
    }else{
      this.setState({loaded: true});
    }
    value = await AsyncStorage.getItem('photoindex');
    if(value == null){
      try {
        await AsyncStorage.setItem('photoindex', "0");
    } catch (error) {
      console.log("Error using storage");
    }
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
  navigate(e){
    console.log(e);
    if(e === "LogOut"){
        this.setState({page: "SignIn"})
        this.signOut();
      }else{
        this.setState({page: e});
    }
  }

  render() {
    if(!this.state.loaded)
      return(<View/>);
    if(this.state.page == 'settings')
      return(<SettingPage method={this.navigate}></SettingPage>)
    if(this.state.signUp) {
      console.log('signup is true');
      return (
        <SignUpProcess signUpAuth={this.needToSignUp} homePage={this.homePage}> </SignUpProcess>
      )
    }
    if(this.state.seeLogInPage) {
      console.log('not logged in is true');
      return (
        <SignInProcess signInAuth={this.authenticate} signUpAuth={this.needToSignUp} homePage={this.homePage}> </SignInProcess>
      )
    }

    if(!this.state.isLoggedInNEW) {
      return (<Homepage logInPage={this.logInPage} signUpPage={this.signUpPage}/>)
    }

    const {hasDefault} = this.state
    if(hasDefault){
      return (
        <Swiper ref='swiper' loop={false} showsPagination={false} index={0} removeClippedSubviews={true}>
        <View style={{flex: 1}}>
          <Browser >
          </Browser>
        </View>
        <View style={{flex: 1}}>
          <MediaComponent method={this.navigate}>
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
