import os
import json
import boto3

dynamodb = boto3.resource('dynamodb')

def get_request(event, context):
    responseBody = {
        "success": "true",
        "httpMethod": event['httpMethod']
    }
    
    username = event["path"][8:]
    candidMedia = dynamodb.Table('candid-mobilehub-1124912258-candidmedia')
    defaultImageTable = dynamodb.Table('candid-mobilehub-1124912258-defaultimages')

    defaultImageRow = defaultImageTable.get_item(
        Key={
            'userId': username
        }
    )
    print(defaultImageRow)
    if 'Item' not in defaultImageRow:
        responseBody["matchingImages"] = str([])   
    
        response_status = {
            "statusCode": 200,
            "headers": {
                "x-custom-header" : "custom header value"
            },
            "body": str(responseBody)
        }
        return response_status
    
    defaultImage = defaultImageRow['Item']['image_uri']
    listOfMatchingImages = []
    fullTable = candidMedia.scan()
    for elem in fullTable['Items']:
        if "," in elem['image_uri']:
            img1, img2 = elem['image_uri'].split(",")
            
            #return the other image
            if defaultImage == img1:
                listOfMatchingImages.append(img2)
            elif defaultImage == img2:
                listOfMatchingImages.append(img1)
                
    
    responseBody["matchingImages"] = str(listOfMatchingImages)   
    
    response_status = {
        "statusCode": 200,
        "headers": {
            "x-custom-header" : "custom header value"
        },
        "body": str(responseBody)
    }
    
    return response_status

def lambda_handler(event, context):
    
    if event['httpMethod'] == "GET":
        return get_request(event, context)
    responseBody = {
        "success": "true",
    }
    
    candidMedia = dynamodb.Table('candid-mobilehub-1124912258-candidmedia')
    defaultImageTable = dynamodb.Table('candid-mobilehub-1124912258-defaultimages')
    requestDict = json.loads(event['body'])
    #requestDict = event
    if True:
        if str(requestDict['default_image']) == "true" or str(requestDict['default_image']) == "True":
            defaultImageTable.put_item(
                Item={
                    "userId": requestDict['username'],
                    "image_uri": requestDict['image_uri']
                }
            )
        else:
            rekognition = boto3.client("rekognition")
            s3bucket = "candid-userfiles-mobilehub-1124912258"
            source = "public/" + str(requestDict['image_uri'])
            faces_detected = rekognition.detect_faces(
                Image={
                    'S3Object': {
                        'Bucket': s3bucket,
                        'Name': source,
                    },
                }
            )
            
            if len(faces_detected['FaceDetails']) <= 0:
                responseBody["faces_detected"] = False
            
            else:
                responseBody["faces_detected"] = True
                fullTable = defaultImageTable.scan()
                
                for elem in fullTable['Items']:
                    s3 = boto3.resource('s3')
                    
                    target = "public/" + str(elem['image_uri'])
                    
                    print ("Source %s; Target %s" % (source, target))
                    
                    response = rekognition.compare_faces(
                        SourceImage={
                            "S3Object": {
                                "Bucket": s3bucket,
                                "Name": source,
                            }
                        },
                        TargetImage={
                            "S3Object": {
                                "Bucket": s3bucket,
                                "Name": target,
                            }
                        },
                        SimilarityThreshold=75
                    )
                    print(response)
                    
                    if len(response["FaceMatches"]) > 0:
                        uri_tuple = requestDict['image_uri'] + "," + elem['image_uri']
                        responseBody["found_a_default_face"] = True
                        candidMedia.put_item(
                            Item={
                                "username": requestDict['username'],
                                "image_uri": uri_tuple,
                                "post_time": 0,
                                "latitude": 0,
                                "longitude": 0
                            }
                        )
    
    response_status = {
        "statusCode": 200,
        "headers": {
            "x-custom-header" : "custom header value"
        },
        "body": str(responseBody)
    }
    
    return response_status
