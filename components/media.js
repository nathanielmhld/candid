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


class MediaComponent extends Component{

	constructor(props) {
    super(props);

    this.state = {
      displayphotos: [],
      storedphotos: [],
      newPics: [],
      displayphoto: null,
      displayindex: 1,
    location: null,
      intervalID: null,
      fontLoaded: false
    }

    this.checkServer = this.checkServer.bind(this);
    }

  async componentDidMount() {
    this.checkServer();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    //this.setState({intervalID: window.setInterval(this.checkServer, 10000)});
    Font.loadAsync({
      'custom-font': require('./../assets/fonts/Molluca.ttf'),
    }).then(response => {this.setState({ fontLoaded: true })});



	}

  _handleNotification = (notification) => {
    this.checkServer();
  };


	async checkServer() {
  	let location = await Location.getCurrentPositionAsync({});
  	this.setState({location: location});
    raw = await AsyncStorage.getItem("user");
    if(raw === null)
      return
  	user = JSON.parse(raw);
    let userId = user.signInUserSession.idToken.payload.name;
    console.log("userId: " + userId);
  	var latitude = location.coords.latitude;
  	var longitude = location.coords.longitude;
  	var time = new Date().getTime();
    apiResponse = await API.get("candidImageHandler","/images/" + userId).catch(error => {
          console.error(error);
          console.error("Darn");
        });
    let newPics = JSON.parse(apiResponse.slice(apiResponse.indexOf("["),apiResponse.lastIndexOf("]") + 1).replace(/'/g, "\""));
    for (i = 0; i < newPics.length; i++) {
    if(!this.state.storedphotos.includes(newPics[i])){
    this.setState({storedphotos: this.state.storedphotos.concat(newPics[i])});
    fileUrl = await Storage.get(newPics[i]);
    let localName = FileSystem.documentDirectory + newPics[i];
    FileSystem.downloadAsync(fileUrl,localName)
        .then(async ({ uri }) => {
          console.log('Finished downloading to ', uri);
          Image.getSize(uri, (width, height) => {
            this.setState({displayphotos: this.state.displayphotos.reverse().concat({key: uri, width: width, height: height}).reverse()});
          }, (error) => {
            console.error(`Couldn't get the image size: ${error.message}`);
          });
        })
      }
    }
  }


	async save(item){
		CameraRoll.saveToCameraRoll(item.key);
    var index = this.state.displayphotos.indexOf(item);
    list = this.state.displayphotos
    if (index > -1) {
      this.state.displayphotos.splice(index, 1);
    }
    this.setState({displayphotos: list})

	}
  displayImage(item){
    return(
      <TouchableOpacity onPress={(e) => {this.save(item);}}>
      <Image source={{ uri: item.key}} style={{width: Dimensions.get('window').width/3, height: (item.height/item.width)*Dimensions.get('window').width/3}}/>
      </TouchableOpacity>
      )
  }

	render(){


		if(this.state.displayphotos !== []){
    return(
      <Container style={styles.headcontainer}>
       <Header style={{ paddingLeft: 10, paddingLeft: 10 }}>
                    <Left>
                        <Text>md-person-add</Text>
                    </Left>
                    <Right>
                        <Ionicons name="ios-more" style={{color:'black', fontSize: 30}}></Ionicons>
                    </Right>
        </Header>
    <View style={styles.wrapper}>
    <ScrollView contentContainerStyle={styles.container}>
        <FlatList
          data={this.state.displayphotos.filter((_,i) => i % 3 == 0)}
          renderItem={({item}) => this.displayImage(item)}
        />
        <FlatList
          data={this.state.displayphotos.filter((_,i) => i % 3 == 1)}
          renderItem={({item}) =>  this.displayImage(item)}
        />
        <FlatList
          data={this.state.displayphotos.filter((_,i) => i % 3 == 2)}
          renderItem={({item}) => this.displayImage(item)}
        />
    </ScrollView>
</View>
</Container>
)}else{
      return(
      <View/>)
    }

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

