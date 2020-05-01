//
//  TodayViewController.swift
//  NYCApp Widget
//
//  Created by Steven Li on 2/24/20.
//  Copyright © 2020 Andy Zheng. All rights reserved.
//

import UIKit
import NotificationCenter
import CoreLocation
import SwiftyJSON

class TodayViewController: UIViewController, NCWidgetProviding, CLLocationManagerDelegate {

    var locationManager: CLLocationManager = CLLocationManager()
    var currentLocation: CLLocation?

    override func viewDidLoad() {
      super.viewDidLoad()
      checkLocationServices()
      let nearByLabel = UILabel(frame: CGRect(x: 5, y: 0, width: 320, height: 21))
      nearByLabel.textAlignment = .left
      nearByLabel.font = UIFont.boldSystemFont(ofSize: 16.0)
      nearByLabel.text = "Nearby Stations:"
      self.view.addSubview(nearByLabel)
      self.extensionContext?.widgetLargestAvailableDisplayMode = .expanded
    }
  
  func widgetActiveDisplayModeDidChange(_ activeDisplayMode: NCWidgetDisplayMode, withMaximumSize maxSize: CGSize) {
    if (activeDisplayMode == NCWidgetDisplayMode.expanded) {
      self.preferredContentSize = CGSize(width: maxSize.width, height: 275);
    } else if (activeDisplayMode == NCWidgetDisplayMode.compact) {
        self.preferredContentSize = maxSize;
    }
  }
  
    func setUpLocationManager() {
      
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        let center = CLLocationCoordinate2D(latitude: location.coordinate.latitude, longitude: location.coordinate.longitude)
        getLocation(center)
    }
    
  func getLocation(_ loc: CLLocationCoordinate2D){
      let url = URL(string: "http://node-express-env.hfrpwhjwwy.us-east-2.elasticbeanstalk.com/trains/\(loc.latitude)/\(loc.longitude)")!
      let task = URLSession.shared.dataTask(with: url, completionHandler: { (data, response, error) in
          if error != nil{
              print("HTTP Request Error")
          }
          if let data = data {
              var totalTrains = 0
              for index in 0...4{
                let trainArr = JSON(data)[index]["dayTimeRoutes"].stringValue.components(separatedBy: " ")
                totalTrains = max(totalTrains, trainArr.count)
              }
              DispatchQueue.main.async {
                for index in 0...4{
                  let yCoordinate = (index * 50) + 25
                  let newStation = UILabel(frame: CGRect(x: (10 + (totalTrains * 20)), y: yCoordinate, width: 300, height: 20))
                  newStation.textAlignment = .left
                  let stationName = JSON(data)[index]["stopName"].stringValue
                  newStation.font = UIFont.boldSystemFont(ofSize: 16.0)
                  newStation.text = stationName
                  let trainArr = JSON(data)[index]["dayTimeRoutes"].stringValue.components(separatedBy: " ")
                  self.view.addSubview(newStation)
                  for train in 0...(trainArr.count - 1){
                    let newTrainImage = UIImage(named: trainArr[train])
                    let newTrainImageView = UIImageView(image: newTrainImage!)
                    newTrainImageView.frame = CGRect(x: (5 + (train * 20)), y: yCoordinate , width: 20, height: 20)
                    self.view.addSubview(newTrainImageView)
                  }
                  let percentageEncodedStation = stationName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)!
                  let stationQuery = URL(string: "http://node-express-env.hfrpwhjwwy.us-east-2.elasticbeanstalk.com/trains/\(percentageEncodedStation)")!
                  let stationTask = URLSession.shared.dataTask(with: stationQuery, completionHandler: { (data, response, error) in
                      if error != nil{
                          print("HTTP Request Error")
                      }
                      if let data = data {
                        DispatchQueue.main.async {
                          let trainTime = UILabel(frame: CGRect(x: 5, y: Double(yCoordinate) + 22.5, width: 380, height: 20))
                          trainTime.textAlignment = .left
                            var earliestTimeInMinutes = Int.max
                          var northTrainTimeText = ""
                          for earliest in 0...(JSON(data).count-1) {
                            if(!JSON(data)[earliest]["North"].isEmpty){
                              if (JSON(data)[earliest]["North"][0].intValue < earliestTimeInMinutes){
                                earliestTimeInMinutes = JSON(data)[earliest]["North"][0].intValue
                                northTrainTimeText = "Uptown: \(JSON(data)[earliest]["TrainNumber"]) - "
                                northTrainTimeText += earliestTimeInMinutes == 0 ? "Now" : earliestTimeInMinutes == 1 ? "\(earliestTimeInMinutes) Min" : "\(earliestTimeInMinutes) Mins"
                              }
                            }
                          }
                          var southBoundEarliestTimeInMinutes = Int.max
                          var southTrainTimeText = ""
                          for earliest in 0...(JSON(data).count-1) {
                            if(!JSON(data)[earliest]["South"].isEmpty){
                              if (JSON(data)[earliest]["South"][0].intValue < southBoundEarliestTimeInMinutes){
                                southBoundEarliestTimeInMinutes = JSON(data)[earliest]["South"][0].intValue
                                southTrainTimeText = "Downtown: \(JSON(data)[earliest]["TrainNumber"]) - "
                                southTrainTimeText += southBoundEarliestTimeInMinutes == 0 ? "Now" : southBoundEarliestTimeInMinutes == 1 ? "\(southBoundEarliestTimeInMinutes) Min" : "\(southBoundEarliestTimeInMinutes) Mins"
                              }
                            }
                          }
                          trainTime.text = northTrainTimeText + "     " + southTrainTimeText
                          self.view.addSubview(trainTime)
                        }
                      }
                  })
                  stationTask.resume()
                }
              }
          }
      })
      task.resume()
    }
 
    func checkLocationServices() {
        if CLLocationManager.locationServicesEnabled(){
            setUpLocationManager()
            checkLocationAuthorization()
        }
        else{
            
        }
    }
    
    func checkLocationAuthorization(){
        switch CLLocationManager.authorizationStatus() {
        case .authorizedWhenInUse:
            locationManager.startUpdatingLocation()
            break
        case .denied:
            break
        case .notDetermined:
            locationManager.requestWhenInUseAuthorization()
        case .restricted:
            break
        case .authorizedAlways:
            print("auhtorized alwasys")
            locationManager.startUpdatingLocation()
            break
        @unknown default:
            break
        }
    }


}
    
