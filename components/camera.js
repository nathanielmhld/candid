import React, { Component } from "react";
import {View, Text, TouchableOpacity, CameraRoll, AsyncStorage} from "react-native";
import {Camera, Permissions, Location} from 'expo'
import {Container, Content, Header, Item, Icon, Input, Button } from "native-base"
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { API, Storage } from 'aws-amplify';
import uniqueId from 'react-native-unique-id';

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

    var random = await uniqueId();
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
    fetch(photo["uri"]).then(response => {
      console.log('done fetching image from disk')
      response.blob().then(blob => {
        Storage.put(image_file_name, blob, options).then(() => {
          console.log('done putting image in storage');
          API.put("candidImageHandler", path, newNote).then(apiResponse => {
            console.log(apiResponse);
            this.setState({apiResponse});
          }).catch(e => {console.log("error uploading to candidImageHandler: " + e)})
        }).catch(e => {console.log("error uploading to storage: " + e)})
      })
    }).catch(e => {console.log("error fetching from phone disk: " + e)})

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

