package com.travel.travelplanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // allows frontend to call this API
public class TravelController {

    @Autowired
    private OpenAIService openAIService;

    @PostMapping("/plan-trip")
    public String planTrip(@RequestBody TravelRequest request) {
        try {
            return openAIService.getItinerary(request);
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
//        String destination = request.getDestination();
//        int days = request.getDays();
//
//        // We'll replace this with OpenAI later
//        return "Planning a " + days + "-day trip to " + destination + "!";
    }
}
