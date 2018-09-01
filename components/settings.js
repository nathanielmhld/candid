import React, {
  Component
} from "react";
import {View, Text, StyleSheet, CameraRoll, AsyncStorage, TouchableOpacity,
  ImageBackground, Image, ScrollView, FlatList, Dimensions
} from "react-native";
import { Camera, Permissions, Location, FileSystem, Notifications, Font} from 'expo'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Amplify, { Storage, API } from 'aws-amplify';
import aws_exports from './../aws-exports';
import { Container, Content, Icon, Header, Left, Body, Right, Segment, Button } from 'native-base'
import { List, ListItem } from "react-native-elements";

class MediaComponent extends Component{

	constructor(props) {
    super(props);

    this.state = {
    }

    }

  async componentDidMount() {
    Font.loadAsync({
      'custom-font': require('./../assets/fonts/Molluca.ttf'),
    }).then(response => {this.setState({ fontLoaded: true })});


	}
  signOut(){
    this.props.method("LogOut");
  }
  reconfig(){
    this.props.method("reconfig");
  }


	render(){
    settingData = [
    {
      key: 1,
      title: "Log Out",
      subtitle: "Come back soon!",
      action: this.signOut
    },
    {
      key: 2,
      title: "Re-ID me",
      subtitle: "Use a new picture of yourself",
      action: this.reconfig
    }
    ]
    return(<List>
      <FlatList
        data={settingData}
        renderItem={({ item }) => (
          <ListItem 
            title={item.title}
            subtitle={item.subtitle}
            onPress={item.action}
            hideChevron
          />
        )}
        keyExtractor={item => item.key}
      />
    </List>)

	}
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
},
headcontainer: {
        flex: 1,
        backgroundColor: 'white'
    },
container: {
    flexDirection: 'row',
    paddingHorizontal: 5
},
list: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 5
},
  slideDefault: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  opacity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'},

  specialtext: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: 56,
    fontFamily: 'custom-font',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 10,}
});

export default MediaComponent

