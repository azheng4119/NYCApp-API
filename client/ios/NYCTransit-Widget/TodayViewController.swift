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

    @IBOutlet weak var latitudeLabel: UILabel!
    @IBOutlet weak var longitudeLabel: UILabel!

    var locationManager: CLLocationManager = CLLocationManager()
    var currentLocation: CLLocation?

    override func viewDidLoad() {
        super.viewDidLoad()
        checkLocationServices()
    }
  
    func setUpLocationManager() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        print("here2")
        guard let location = locations.last else { return }
        let center = CLLocationCoordinate2D(latitude: location.coordinate.latitude, longitude: location.coordinate.longitude)
        let latitudeText = String(format: "Lat: %.4f",
            center.latitude)
        let longitudeText = String(format: "Lon: %.4f",
            center.longitude)
        latitudeLabel.text = latitudeText
        longitudeLabel.text = longitudeText
        getLocation(center)
        print(center)
    }
    
  func getLocation(_ loc: CLLocationCoordinate2D){

      let url = URL(string: "http://node-express-env.hfrpwhjwwy.us-east-2.elasticbeanstalk.com/trains/40.715630/-74.012108")!
      let task = URLSession.shared.dataTask(with: url, completionHandler: { (data, response, error) in
          if error != nil{
              print("HTTP Request Error")
          }
          if let data = data {
              print(JSON(data).count)
              print(JSON(data))
              print("test")
              print(JSON(data)[0])
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
    
