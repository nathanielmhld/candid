import React from 'react';
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';
import Amplify, { API, Storage } from 'aws-amplify';
import {Auth } from 'aws-amplify';

export default class SignInProcess extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    user: {}
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
      this.props.signInAuth(true);
    })
    .catch(err => console.log(err))
  }
  signUpNow() {
    this.props.signUpAuth(true);
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
});
