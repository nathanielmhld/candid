import React from 'react';
import {TextInput, Button, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, ScrollView} from 'react-native';
import {Auth} from 'aws-amplify';
import {Font} from 'expo';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import SignUpName from './signupName';


export default class PrivatePolicy extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      email: '',
      user: {},
      fontLoaded: false,
      passwordIssue: false,
      phoneIssue: false,
      loginEnabled: false,
      loginStyle: {},
      loginHighlightColor: '',
      inputStyle: {},
      phoneInputStyle:{}
    }
  }

  homePageJump() {
    this.props.homePage();
  }
  onChangeText(key, value) {

    if(key === 'password') {
      if(value.length < 6) {
        this.setState({
          'passwordIssue': true
        })
      } else {
        this.setState({
          'passwordIssue': false
        })
      }
    }
    if(key === 'username') {
      var phoneno = /^\d{10}$/;
      var phoneno1 = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      var phoneno2 = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
      var phoneno3 = /^\+1\d{101`````````````````````````````````````````````````````````````````````````````````````````````````}$/;

      if(phoneno.test(value) || phoneno1.test(value) || phoneno2.test(value) || phoneno3.test(value)) {
        this.setState({
          'phoneIssue': false
        })
      } else {
        this.setState({
          'phoneIssue': true
        })
      }
    }

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
    if(this.state.username && this.state.password && this.state.email && !this.state.passwordIssue && !this.state.phoneIssue) {
      this.state.loginEnabled = false;
      this.state.loginStyle = styles.loginButton;
      this.state.loginHighlightColor = "#21ce99";
    } else {
      this.state.loginEnabled = true;
      this.state.loginStyle = styles.disabledLoginButton;
      this.state.loginHighlightColor = "grey";
      if(this.state.passwordIssue) {
        this.state.inputStyle = styles.inputError;
      } else {
        this.state.inputStyle = styles.input;
      }
      if(this.state.phoneIssue) {
        this.state.phoneInputStyle = styles.inputError;
      } else {
        this.state.phoneInputStyle = styles.input;
      }
    }
    return (
        <ScrollView>
          <View style={styles.header}>
              <View>
              <TouchableOpacity onPress={this.props.homePage}>
                <MaterialCommunityIcons name="arrow-left" style={{color:'#21ce99', fontSize: 35}}></MaterialCommunityIcons>
                </TouchableOpacity>
              </View>
              <View>
                {this.state.fontLoaded ? (
                  <Text style={styles.text}>Private Policy</Text>) : null
                }
              </View>

        </View>
      </ScrollView>
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
    marginRight: 25,
    marginTop: 25,
    marginBottom: 10
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
    marginLeft: 25,
    marginRight: 25,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 0,
    paddingHorizontal: 0
  },
  inputError: {
    marginLeft: 25,
    marginRight: 25,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    paddingBottom: 0,
    paddingHorizontal: 0
  },
  loginButton: {
    backgroundColor: "#21ce99",
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
  },
  disabledLoginButton: {
    backgroundColor: "grey",
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
  },
  viewLoginButton: {
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 20
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
    textAlign: 'right',
    width: 275
  },
  issue: {
    color: 'red',
    fontSize: 15,
    textAlign: 'center',
  }
});

