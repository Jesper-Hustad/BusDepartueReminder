// not actually json, but alot easier to import

var headers = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en,nb-NO;q=0.9,nb;q=0.8,en-US;q=0.7,no;q=0.6",
    "Connection": "keep-alive",
    "Content-Length": "2445",
    "Content-Type": "application/json",
    "DNT": "1",
    "ET-Client-Name": "entur-tavla",
    "Host": "api.entur.io",
    "Origin": "https://tavla.entur.no",
    "Referer": "https://tavla.entur.no/t/7WszMOcWw12DNKMwGfgw",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36",
}

var body = function(stopPlaceId){
    var startDate = new Date().toISOString()
    return {
    "query":"query( $ids: [String]!, $start: DateTime!, $timeRange: Int!, $limit: Int!, $limitPerLine: Int, $omitNonBoarding: Boolean!, $whiteListedLines: [String!], $whiteListedAuthorities: [String!], $whiteListedModes: [Mode], $includeCancelledTrips: Boolean! ) { stopPlaces(ids: $ids) { id estimatedCalls( startTime: $start, timeRange: $timeRange, numberOfDepartures: $limit, numberOfDeparturesPerLineAndDestinationDisplay: $limitPerLine, omitNonBoarding: $omitNonBoarding, whiteListed: { lines: $whiteListedLines, authorities: $whiteListedAuthorities, }, whiteListedModes: $whiteListedModes, includeCancelledTrips: $includeCancelledTrips ) { ...estimatedCallFields } } } fragment estimatedCallFields on EstimatedCall { actualArrivalTime actualDepartureTime aimedArrivalTime aimedDepartureTime cancellation date destinationDisplay { frontText } expectedDepartureTime expectedArrivalTime forAlighting forBoarding notices { ...noticeFields } predictionInaccurate quay { ...quayFields } realtime requestStop serviceJourney { ...serviceJourneyFields } situations { ...situationFields } } fragment noticeFields on Notice { text } fragment quayFields on Quay { id name description publicCode situations { ...situationFields } stopPlace { ...stopPlaceFields } } fragment situationFields on PtSituationElement { situationNumber summary { language value } description { language value } advice { language value } detail { language value } lines { ...lineFields } validityPeriod { startTime endTime } reportType infoLinks { uri label } } fragment lineFields on Line { bookingArrangements { ...bookingArrangementFields } description flexibleLineType id name notices { ...noticeFields } publicCode transportMode transportSubmode } fragment bookingArrangementFields on BookingArrangement { bookingMethods bookingNote minimumBookingPeriod bookingContact { phone url } } fragment stopPlaceFields on StopPlace { id description name latitude longitude tariffZones { id } } fragment serviceJourneyFields on ServiceJourney { id journeyPattern { line { ...lineFields } notices { ...noticeFields } } notices { ...noticeFields } publicCode privateCode transportSubmode }",
    "variables":{
        "ids":[stopPlaceId,""],
        "includeCancelledTrips":false,
        "start": startDate,
        "omitNonBoarding":true,
        "timeRange":72000,
        "limit":200,
        "limitPerLine":3,
        "whiteListedModes":["bus","tram","rail","metro","water","air","coach","car","foot","bicycle"]
        }
    }
}