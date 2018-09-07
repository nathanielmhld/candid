import React from 'react';
import {TextInput, Button, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, ScrollView} from 'react-native';
import {Header} from 'native-base';

import {Auth} from 'aws-amplify';
import {Font} from 'expo';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';


export default class SignUpName extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      user: {},
      fontLoaded: false,
      issue: null
    }
  }

  homePageJump() {
    this.props.homePage();
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  backToSignIn(){
    this.props.signUpAuth(false);
  }

  componentDidMount() {
    Font.loadAsync({
      'custom-font': require('./../assets/fonts/Roboto-Bold.ttf'),
    }).then(response => {this.setState({ fontLoaded: true })});
  }

  signUp() {
    Auth.signUp({
      username: this.state.username,
      password: this.state.password,
      attributes: {
        name: this.state.email
      }
    })
    .then(() => {
      console.log('successfully signed up!');
      this.props.signUpAuth(false);
    })
    .catch(error => console.log(error))
  }

  confirmSignUp() {
    Auth.confirmSignUp(this.state.username, this.state.email_code)
    .then(() => {
      console.log('confirmed sign up!')
      this.props.signUpAuth(false);
    })
    .catch(err => console.log('error confirming signing up: ', err))

  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
              <View>
              <TouchableOpacity onPress={this.props.homePage}>
                <MaterialCommunityIcons name="arrow-left" style={{color:'#21ce99', fontSize: 35}}></MaterialCommunityIcons>
                </TouchableOpacity>
              </View>
              <View>
                {this.state.fontLoaded ? (
                  <Text style={styles.text}>What's your name?</Text>) : null
                }
              </View>
          <View style={{flexDirection:'column'}}>
            {this.state.issue ? (
              <Text style={styles.issue}>{this.state.issue}</Text>) : null
            }
            <View style={styles.inputView}>
              <Text style={styles.inputText}>First Name</Text>
            </View>
            <TextInput
              onChangeText={value => this.onChangeText('email', value)}
              style={styles.input}
            />
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Last Name</Text>
            </View>
            <TextInput
              keyboardType={'phone-pad'}
              onChangeText={value => this.onChangeText('username', value)}
              style={styles.input}
            />
        </View>
        <View style={styles.viewLoginButton}>
          <TouchableHighlight style={styles.loginButton} onPress={this.signUp.bind(this)} underlayColor='#21ce99'>
            <Text style={styles.textContainer}>Continue</Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    marginBottom: 20,
    flexDirection:'row',
    marginLeft: 20
  },
  inputView: {
    marginLeft: 25,
    marginRight: 25
  },
  inputText: {
    color: 'grey'
  },
  signInView: {
    marginTop: 20,
    marginBottom: 20
  },
  textContainer: {
    height: 45,
    lineHeight: 45,
    textAlign: 'center',
    fontWeight: 'bold',
    color: "white"
  },
  input: {
    height: 50,
    marginLeft: 25,
    marginRight: 25
  },
  loginButton: {
    backgroundColor: "#21ce99",
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
  },
  viewLoginButton: {
    marginLeft: 75,
    marginRight: 75,
    marginTop: 20
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 35,
    fontFamily: 'custom-font',
    //fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25
  },
  issue: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  }
});

