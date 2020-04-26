//
//  TodayViewController.swift
//  NYCTransit-Widget
//
//  Created by Steven Li on 4/26/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import UIKit
import NotificationCenter
import CoreLocation

class TodayViewController: UIViewController, NCWidgetProviding, CLLocationManagerDelegate {
        
    let locationManager = CLLocationManager()
    @IBAction func btnGetLocation(_ sender: Any) {
       let locStatus = CLLocationManager.authorizationStatus()
       switch locStatus {
          case .notDetermined:
             locationManager.requestWhenInUseAuthorization()
          return
          case .denied, .restricted:
             let alert = UIAlertController(title: "Location Services are disabled", message: "Please enable Location Services in your Settings", preferredStyle: .alert)
             let okAction = UIAlertAction(title: "OK", style: .default, handler: nil)
             alert.addAction(okAction)
             present(alert, animated: true, completion: nil)
          return
          case .authorizedAlways, .authorizedWhenInUse:
          break
       }
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }
        
    func widgetPerformUpdate(completionHandler: (@escaping (NCUpdateResult) -> Void)) {
        // Perform any setup necessary in order to update the view.
        
        // If an error is encountered, use NCUpdateResult.Failed
        // If there's no update required, use NCUpdateResult.NoData
        // If there's an update, use NCUpdateResult.NewData
        
        completionHandler(NCUpdateResult.newData)
    }
    
}
