
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  CameraRoll,
  ScrollView,
  Platform,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  RefreshControl,
  AsyncStorage,
} from 'react-native';
import { API, Storage } from 'aws-amplify';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export default class Browser extends Component {

state = {media: []}

constructor(props){
  super(props);
  this.state = {
      refreshing: false,
      media: [],
      cursor: 0,
      apiResponse: null,
      noteId: ''
    };
}
 handleChangeNoteId = (event) => {
    this.setState({noteId: event});
  };
componentDidMount(){
  this.loadphotos(50);

// fill 'Library photos' example with local media
}
sendPicture = async (photo) => {
  var time0 = Date.now();
  var time = new Date().getTime();

  //let location = await Location.getCurrentPositionAsync({});
  var latitude = 0; //location.coords.latitude;
  var longitude = 0;//location.coords.longitude;

  user = JSON.parse(await AsyncStorage.getItem("user"));
  let userId = user["username"];

  var random = String(time)+String(latitude)+String(longitude)+String(userId);
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
  fetch(photo).then(response => {
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
}
loadphotos(howmany){
  CameraRoll.getPhotos({
  first: howmany + this.state.cursor,
  assetType: 'Photos',
})
  .then(data => {
    const media = this.state.media;
    data.edges.forEach((d, i) =>
      {if(i >= this.state.cursor){
      media.push({
        photo: d.node.image.uri,
        key: d.node.image.uri,
        width: d.node.image.width,
        height: d.node.image.height,
      })}},
    );
    this.setState({media: media, cursor: this.state.cursor + howmany});
  })
  .catch(error => alert(error));
}

load(){
  this.loadphotos(50)
}
displayImage(item){
  return(
    <TouchableOpacity onPress={(e) => {this.sendPicture(item.photo);}}>
    <Image source={{ uri: item.photo}} style={{width: Dimensions.get('window').width/3, height: (item.height/item.width)*Dimensions.get('window').width/3}}/>
    </TouchableOpacity>
    )
}

  render() {
    if(this.state.media !== []){
    return(
    <View style={styles.wrapper}>
    <ScrollView contentContainerStyle={styles.container}
    onScroll={({nativeEvent}) => {
      if (isCloseToBottom(nativeEvent)) {
        this.load();
      }
    }}
    scrollEventThrottle={400}>
        <FlatList
  data={this.state.media.filter((_,i) => i % 3 == 0)}
  renderItem={({item}) => this.displayImage(item)}/>
        <FlatList
  data={this.state.media.filter((_,i) => i % 3 == 1)}
  renderItem={({item}) =>  this.displayImage(item)}/>
        <FlatList
  data={this.state.media.filter((_,i) => i % 3 == 2)}
  renderItem={({item}) =>  this.displayImage(item)}
/>
    </ScrollView>
</View>
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
container: {
    flexDirection: 'row',
    paddingHorizontal: 5
},
list: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 5
}
});