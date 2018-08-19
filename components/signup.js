import React from 'react';
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';
import Amplify, { API, Storage } from 'aws-amplify';
import {Auth } from 'aws-amplify';


export default class SignUpProcess extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    email_code: ''
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  signUp() {
    Auth.signUp({
      username: this.state.username,
      password: this.state.password,
      attributes: {
        email: this.state.email
      }
    })
    .then(() => console.log('success sign up!'))
    .catch(err => console.log(err))
  }

  //For MFA

  confirmSignUp() {
    Auth.confirmSignUp(this.state.username, this.state.email_code)
    .then(() => {
      console.log('successful confirm sign up!')
      this.props.signUpAuth(false);
    })
    .catch(err => console.log('error confirming signing up!: ', err))

  }

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
        <TextInput
          onChangeText={value => this.onChangeText('email', value)}
          style={styles.input}
          placeholder='email'
        />
        <Button title="Sign Up" onPress={this.signUp.bind(this)} />
        <TextInput
          onChangeText={value => this.onChangeText('email_code', value)}
          style={styles.input}
          placeholder='email_code'
        />
        <Button title="Confirm Email Code" onPress={this.confirmSignUp.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    margin: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
