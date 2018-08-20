import React from 'react';
import { TextInput, Button, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import Amplify, { API, Storage } from 'aws-amplify';
import {Auth } from 'aws-amplify';
import {Font} from 'expo';

export default class SignInProcess extends React.Component {
  state = {
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  signIn() {
    console.log('trying to log in');
    Auth.signIn(this.state.username, this.state.password)
    .then(user => {
      this.setState({'user': user});
      AsyncStorage.setItem('user', JSON.stringify(user));
      this.props.signInAuth(true);
    })
    .catch(err => this.setState({issue: err['message']}))
    
    
  }
  signUpNow() {
    this.props.signUpAuth(true);
  }
  componentDidMount() {
    Font.loadAsync({
      'custom-font': require('./../assets/fonts/Molluca.ttf'),
    }).then(response => {this.setState({ fontLoaded: true });});
    this.state = {
    username: '',
    password: '',
    email: '',
    user: {},
    fontLoaded: false,
    issue: null
  }
  }

  //For MFA
  /*
  confirmSignUp() {
    Auth.confirmSignUp(this.state.username, this.state.confirmationCode)
    .then(() => console.log('successful confirm sign up!'))
    .catch(err => console.log('error confirming signing up!: ', err))
  }*/

  render() {
    return (
      <View style={styles.container}>
      
      {this.state.fontLoaded ? (
      <Text style={styles.text}>Candid</Text>) : null}
      {this.state.issue ? (
      <Text style={styles.issue}>{this.state.issue}</Text>) : null}
        <TextInput
          onChangeText={value => this.onChangeText('username', value)}
          style={styles.input}
          placeholder='username'
        />
        <TextInput
          onChangeText={value => this.onChangeText('password', value)}
          style={styles.input}
          secureTextEntry={true}
          placeholder='password'
        />
        <Button buttonStyle={styles.loginButton} title="Login Now" onPress={this.signIn.bind(this)}  />
        <Button title="Sign Up" onPress={this.signUpNow.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    margin: 10,
    marginLeft: 25,
    marginRight: 25
  },
  loginButton: {
    backgroundColor: "rgba(92, 99,216, 1)",
    width: 300,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 5
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 50,
    fontFamily: 'custom-font',
    //fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
  },
  issue: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  }
});
