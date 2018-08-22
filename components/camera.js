import React, { Component } from "react";
import {View, Text, TouchableOpacity, CameraRoll, AsyncStorage} from "react-native";
import {Camera, Permissions, Location} from 'expo'
import {Container, Content, Header, Item, Icon, Input, Button } from "native-base"
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import AWSHandler from '../ServerHandler/AWSHandler'

class CameraComponent extends Component {
	constructor(props) {
    super(props);
    this.state = {
      Permission: null,
      type: Camera.Constants.Type.back,
      apiResponse: null,
      noteId: ''
    };
  };

  uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  handleChangeNoteId = (event) => {
    this.setState({noteId: event});
	};

	async componentDidMount() {
		camera = await Permissions.askAsync(Permissions.CAMERA);
		cameraRoll = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    location = await Permissions.askAsync(Permissions.LOCATION);
    if(camera && cameraRoll && location)
		  this.setState({Permission: true});
	}

	snap = async () => {
  var time0 = Date.now();
  if (this.camera) {
    var time = new Date().getTime();
    let photo = await this.camera.takePictureAsync();

    //let location = await Location.getCurrentPositionAsync({});
    var latitude = 0; //location.coords.latitude;
    var longitude = 0;//location.coords.longitude;

    user = JSON.parse(await AsyncStorage.getItem("user"));
    let userId = user["username"];

    var random = this.uuidv4();
    var image_file_name = "image" + random + ".jpg";
    //New
    let newNote = {
      body: {
  	   "image_uri": image_file_name,
  	   "latitude": latitude,
  	   "longitude": longitude,
  	   "post_time": time,
       "username": userId,
       "default_image": false
     }
    }
    const path = "/images";

    const options = { level: 'public', contentType: 'image/jpeg' };

    AWSHandler.handleImageUpload(newNote, photo["uri"], image_file_name);

    CameraRoll.saveToCameraRoll(photo["uri"]);
	}
};

	render(){
		const {Permission} = this.state
		if(Permission === null)
		{
			return <View />
		}
		else if(Permission === false)
		{
			return <Text> No access to camera </Text>
		} else {
			return(

			<View style={{flex:1}}>
				<Camera style={{flex:1}} type={this.state.type} ref={ref => { this.camera = ref; }}>
				<View style={{position: 'absolute', right: 0, top: 15}}>
					<TouchableOpacity onPress={this.props.signout}>
					<Octicons name="sign-out" style={{color:'white', fontSize: 50}}></Octicons>
					</TouchableOpacity>
          </View>
          <View style={{position: 'absolute', left: 0, top: 15}}>
          <TouchableOpacity onPress={this.props.configure}>
          <MaterialCommunityIcons name="backup-restore" style={{color:'white', fontSize: 50}}></MaterialCommunityIcons>
          </TouchableOpacity>
				</View>

				<View style={{position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}>
					<TouchableOpacity onPress={this.snap}>
					<MaterialCommunityIcons name="circle-outline" style={{color:'white', fontSize: 100}}></MaterialCommunityIcons>
					</TouchableOpacity>
				</View>
				</Camera>
			</View>

			)
		}
	}
}

export default CameraComponent

