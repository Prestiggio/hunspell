const QuotationSample = {
    "@context": "https://schema.org/",
    "@type": "Quotation",
    "spokenByCharacter": {
        "@type": "Person",
        "@id": "http://musicbrainz.org/artist/4d5447d7-c61c-4120-ba1b-d7f471d385b9",
        "name": "George Bush",
        "disambiguatingDescription": "41st President of the United States",
        "email": "mailto:jane-doe@xyz.edu",
        "image": "janedoe.jpg",
        "jobTitle": {
            "@type": "DefinedTerm",
            "inDefinedTermSet": "https://targetjobs.co.uk/careers-advice/job-descriptions",
            "termCode": "277133-aid-workerhumanitarian-worker-job-description",
            "name": "Aid worker/humanitarian worker",
            "url": "https://targetjobs.co.uk/careers-advice/job-descriptions/277133-aid-workerhumanitarian-worker-job-description"
        },
        "url": "http://www.janedoe.com",
        "sameAs": "http://www.janedoe.com",
        "telephone": "(425) 123-4567",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Seattle",
            "addressRegion": "WA",
            "postalCode": "98052",
            "streetAddress": "20341 Whitworth Institute 405 N. Whitworth"
        },
        "hasOccupation": [
            {
                "@type": "Role",
                "hasOccupation": {
                    "@type": "Occupation",
                    "name": "Patent examiner",
                    "occupationalCategory": "23-2099.00"
                },
                "startDate": "1901",
                "endDate": "1906"
            },
            {
                "@type": "Occupation",
                "name": "Professor of Physics",
                "educationRequirements": "PhD in Physics"
            }
        ],
        "interactionStatistic": [
            {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/LikeAction",
                "userInteractionCount": 1170
            },
            {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/FollowAction",
                "userInteractionCount": 145098
            }
        ],
        "performerIn": [
            {
                "@type": "Event",
                "offers": "ticketmaster.com/foofighters/may20-2011",
                "startDate": "2011-05-20",
                "endDate": "2025-07-21T23:00-05:00",
                "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
                "eventStatus": "https://schema.org/EventScheduled",
                "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
                "subEvent": [{}],
                "superEvent": {},
                "typicalAgeRange": "18-",
                "workFeatured": [],
                "workPerformed": [],
                "inLanguage": {
                    "@type": "Language",
                    "name": "Spanish",
                    "alternateName": "es"
                  },
                  "isAccessibleForFree": true,
                  "maximumAttendeeCapacity": 500,
                  "maximumPhysicalAttendeeCapacity": 500,
                  "maximumVirtualAttendeeCapacity": -1,
                  "remainingAttendeeCapacity": 500,
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "bestRating": "100",
                    "ratingValue": "4",
                    "reviewCount": "250"
                },
                "location": [{
                    "@type": "VirtualLocation",
                    "url": "https://operaonline.stream5.com/"
                },
                {
                    "@type": "Place",
                    "name": "Snickerpark Stadium",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "100 West Snickerpark Dr",
                        "addressLocality": "Snickertown",
                        "postalCode": "19019",
                        "addressRegion": "PA",
                        "addressCountry": "US"
                    }
                }],
                "attendee": [
                    //person or organisation
                ],
                "audience": {
                    "@type": "Audience",
                    "name": "Small businesses",
                    "audienceType": "Mpianatra komonio voalohany",
                    "geographicArea": {
                        //faritra - https://schema.org/AdministrativeArea
                    }
                },
                "composer": [
                    //persons
                ],
                "contributor": [
                    //persons
                ],
                "director": [
                    //persons
                ],
                "doorTime": "2022-01-01T04:00:00",
                "image": [
                    "https://example.com/photos/1x1/photo.jpg",
                    "https://example.com/photos/4x3/photo.jpg",
                    "https://example.com/photos/16x9/photo.jpg"
                ],
                "url": "foo-fighters-may20-fedexforum",
                "performer": [
                    {
                        "@type": "PerformingGroup",
                        "name": "Kira and Morrison"
                    },
                    {
                        "@type": "MusicGroup",
                        "name": "Typhoon",
                        "sameAs": "http://en.wikipedia.org/wiki/Typhoon_(American_band)"
                    },
                    {
                        "@type": "MusicGroup",
                        "name": "RadiationCity",
                        "sameAs": "http://en.wikipedia.org/wiki/Radiation_City"
                    }
                ],
                "organizer": {
                    "@type": "Organization",
                    "name": "Kira and Morrison Music",
                    "url": "https://kiraandmorrisonmusic.com"
                },
                "duration": "PT60M", //60 minutes //https://en.wikipedia.org/wiki/ISO_8601
                "previousStartDate": [
                    //efa nisy daty taloha fa nahemotra noho ny covid
                ],
                "eventSchedule": [{
                    "@type": "Schedule",
                    "startDate": "2017-01-01",
                    "endDate": "2017-12-31",
                    "repeatFrequency": "P1W",
                    "byDay": "https://schema.org/Wednesday",
                    "startTime": "19:00:00",
                    "endTime": "20:00:00",
                    "scheduleTimezone": "Europe/London"
                }, {
                    "@type": "Schedule",
                    "repeatFrequency": "P1D",
                    "byDay": [
                        "https://schema.org/Monday",
                        "https://schema.org/Tuesday",
                        "https://schema.org/Wednesday",
                        "https://schema.org/Thursday",
                        "https://schema.org/Friday"
                    ],
                    "startTime": "09:00:00",
                    "endTime": "10:00:00",
                    "scheduleTimezone": "America/Glace_Bay"
                }]
            },
            {
                "@type": "Event",
                "location": "Council Bluffs, IA, US",
                "offers": "ticketmaster.com/foofighters/may23-2011",
                "startDate": "2011-05-23",
                "url": "foo-fighters-may23-midamericacenter"
            }
        ]
    },
    "creator": {
        "@type": "Person",
        "@id": "http://musicbrainz.org/artist/4d5447d7-c61c-4120-ba1b-d7f471d385b9",
        "name": "Franklin Delano Roosevelt",
        "url": "http://www.janedoe.com",
        "interactionStatistic": [
            {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/LikeAction",
                "userInteractionCount": 1170
            },
            {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/FollowAction",
                "userInteractionCount": 145098
            }
        ],
        "performerIn": [
            {
                "@type": "Event",
                "location": "Memphis, TN, US",
                "offers": "ticketmaster.com/foofighters/may20-2011",
                "startDate": "2011-05-20",
                "url": "foo-fighters-may20-fedexforum"
            },
            {
                "@type": "Event",
                "location": "Council Bluffs, IA, US",
                "offers": "ticketmaster.com/foofighters/may23-2011",
                "startDate": "2011-05-23",
                "url": "foo-fighters-may23-midamericacenter"
            }
        ]
    },
    "text": "Help me Obi Wan Kenobi, you're my only hope.",
    "isPartOf": {
        "@type": "Movie",
        "name": "Star Wars Episode IV: A New Hope"
    }
}