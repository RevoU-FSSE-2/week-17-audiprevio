![Group 2 (2)](https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/eb0ebe7b-1477-4a9d-b323-ab6a277f6e39)
# SouthTrack React - Firebase FE & BE Integration & PWA

### Shorthand Notes:
<b>SIOS: SouthTrack on iOS -> iOS PWA of SouthTrack for XCode</b>
<br />
<b>SAND: SouthTrack on Android -> Android PWA of SouthTrack for Android Studio</b>

<a id="table-of-contents"></a>
## Table of Contents

- [1. Introduction](#1-introduction)
- [2. SouthTrack Deployed on Firebase](#2-southtrack-deployed-on-firebase)
- [3. Backend Unit Testing of SouthTrack](#3-backend-unit-testing-of-southtrack)
- [4. Mobile Responsiveness of SouthTrack](#4-mobile-responsiveness-of-southtrack)
- [5. Lighthouse Performance of SouthTrack](#5-lighthouse-performance-of-southtrack)
- [6. PWA Set-up](#6-pwa-set-up)
- [7. PWA Showcase on Xcode (iOS)](#7-pwa-showcase-on-xcode-ios)
- [8. PWA Showcase on Android](#8-pwa-showcase-on-android)
- [9. Big, big thanks](#9-big-big-thanks)


## 1. Introduction
Previously, [SouthTrack](https://github.com/audiprevio/southTrackReactv001)https://github.com/audiprevio/southTrackReactv001 was deployed on Netlify (front-end) and Fly.io (back-end). However, in this repo, SouthTrack has been deployed to FireBase.
```
ACCESS FOR TESTERS
TVK: penguin
Feel free to make your own account - follow the regist instruction - & your own penguin too!
```
<br />
<br />

[Back to Table of Contents](#table-of-contents)
---

## 2. SouthTrack Deployed on Firebase
Do note that SouthTrack React was and still is an integrated front-end and back-end application. The front-end and back-end that was used before firebase is the same as in this one.

To visit the SouthTrack that's deployed to Firebase, you can visit:
### https://week-17-audi.web.app/

<br/>

Back-end API Documentation:
### https://documenter.getpostman.com/view/2s9YRB3Xda?version=latest

<br/>
<br/>
<br/>

<b>Fig 1.1: Front-end integration (Hosting) to Firebase</b>
<br/>
<br/>
<img width="1440" alt="Screenshot 2023-10-21 at 01 06 39" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/c20b4cbf-cf6f-4aef-a834-b3fa2f3026e6">

<b>Fig 1.2: Back-end integration (Functions) to Firebase</b>
<br/>
<br/>
<img width="1439" alt="Screenshot 2023-10-21 at 01 06 20" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/6e1ff424-3791-475b-bbd2-22a2c6e5c6f9">


<b>Step by step deployment</b>
1. Create the project and structure it the way like this repo. Put all the backend (index.js, controller, etc.) inside a 'backend' folder and the frontend on the 'frontend'

2. Install firebase dependencies 
` npm i firebase-tools `

3. Init both the back and front end of the project
` firebase init ` 
be mindful that the options should be in accordance to your firebase project. There are also some configs you need to do, depending on your project structure.

4. Deploy the initialized projects using `firebase deploy --only hosting` (for frontend) and `firebase deploy --functions` (for backend) or `firebase deploy` (for both)

<br />
<br />
<br />

[Back to Table of Contents](#table-of-contents)
---

## 3. Backend Unit Testing of SouthTrack - 100% Pass

Backend of SouthTrack has passed 100% for all end points (8 total - 2 test suites for user & penguin controller)
 <img width="1273" alt="Screenshot 2023-10-21 at 01 41 58" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/025bd0d8-97bf-4059-8ac0-dad43cc39368">


<br/>
<br/>
Snippet of Unit Tests:

```js
const { createAdmin, getAdmin, updateAdminPassword, softDeleteAdmin, loginAdmin } = require('../../controllers/adminController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../models/allModel', () => {
  const mockAdminData = {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    find: jest.fn()
  };

  function MockAdminData() {
    return this;
  }
  MockAdminData.prototype.save = jest.fn();

  return {
    adminData: Object.assign(MockAdminData, mockAdminData),
  };
});

const mockAdminData = require('../../models/allModel').adminData;

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('adminController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createAdmin', async () => {
    bcrypt.hash.mockResolvedValue('hashedPassword');
    const req = { body: { username: 'test', employeeId: 'test', password: 'test', role: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    mockAdminData.findOne.mockResolvedValue(null);
  
    await createAdmin(req, res);
  
    expect(mockAdminData.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin created successfully' });
  });

```

<br />
<br />
<br />

[Back to Table of Contents](#table-of-contents)
---

## 4. Mobile Responsiveness of SouthTrack


SouthTrack's front-end has been tested to be front-end on various devices
<br />

![Group 1 (1)](https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/b6beb027-b6e5-483d-b021-c9b20a54423a)


<br />

Why the need to screenshot on different devices? <b>because sometimes, the chrome devtool are innacurate on displaying the interface in iOS devices</b>
For instance, SouthTrack, initially suffered from auto zoom feature that automatically zoom in the users' screen. This is because, iOS devices forces auto-zoom on form fields. As a stop gap, the following line of code has to be employed:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

```

Moreover, Chromedevtool even on MacBook can fail to catch inconsistencies in styling that can occur in iOS devices like iPad and iPhone.
<br />
<br />
<br />

[Back to Table of Contents](#table-of-contents)
---

## 5. Lighthouse Performance of SouthTrack

The Lighthouse report of SouthTrack differs based on the method used. The Chrome extension for lighthouse can yields all result with no issues. GRANTED, it only captures the login page for some reason. Even if you are currently logged in and viewing them penguins.
<br />
<br />
<i>Fig 1.3 Lighthouse test using Extension</i>
<br />
<img width="1440" alt="Screenshot 2023-10-21 at 02 12 20" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/2aea08d5-a3c7-4fcc-b04e-ac7645ef9bbf">
<img width="823" alt="Screenshot 2023-10-21 at 02 12 50" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/c3cb6e3c-215b-4b02-bbf8-7877936f8c31">



<br />
<br />
Lighthouse test for SouthTrack has this bug that most of the time returns an error on the accessibility score, note the exclamation mark as the score icon
<br />
<br />
<i>Fig 1.4 Lighthouse test using Chrome Dev Tools - Error </i>
<br />
<img width="1440" alt="Screenshot 2023-10-21 at 02 14 30" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/4c3c3aea-33b1-4c70-b346-c7db734e4609">

But, occassionally, <i>without code tampering</i>, it can yield the accessibility result, notice the 89 Accessibility score on the same page as the above test which is `week-17-audi.web.app/`
<br />
<br />
<i>Fig 1.5 Lighthouse test using Chrome Dev Tools - Successful </i>
<br />
<img width="1130" alt="Screenshot 2023-10-21 at 02 17 08" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/a6a6535a-13ea-4c07-8f1c-252a9461da2f">

<br />
The bug in question is this one below. As of this point, <u>I have yet to uncover which part(s) of the code trigger this bug</u>, because from the get go, there was no explicit installation of axe-core. I tried to install it later after finding out this bug, but it doesn't help with anything.
<br />
<br />
<i>Fig 1.6 The Bug: `axe-core Error: vf[r] is not a function` </i>
<br />
<img width="546" alt="Screenshot 2023-10-21 at 02 21 38" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/d6f58686-a6d9-4ebe-8206-56363f43615d">

[Back to Table of Contents](#table-of-contents)
---

## 6. PWA Set-up
Let me say it from the get go,
<b>PWA IS AMAZING</b>

SouthTrack has been successfully converted into a PWA as shown within this dashboard
<br />
<br />
<i>Fig 1.7 PWA Success </i>
<br />
<br />
<img width="898" alt="Screenshot 2023-10-21 at 02 26 20" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/c90e9b5b-17b9-4b46-80ba-c77a8e35f472">
<br />
<br />
The process was rather CUMBERSOME because the process of <b> setting up manifests.json & the related materials (including service workers) -> placing it within the frontend public folder (can't put it directly on dist because vite will clean it up after you build the frontend -> using `npm run build` so that it will be built -> deploy it to firebase </b>

It is very lengthy and the placement of items and imports has to be very precise, which is difficult when you are using Vite, because it has to be in the public folder, so vite can generate in the dist folder. 

And any failures or changes in the manifests, means that you have to repeat the process all over again, while also bearing in mind the correct placement of things.

Also for some reason, this is needed for me  ` <link rel="manifest" href="/manifest.json">` in order for the pwabuilder.com to detect the manifest.json.


In terms of service worker, I decided to use the Offline Pages provided by **https://www.pwabuilder.com/**
```
Offline Pages
This simple but elegant solution pulls a file from your web server called "offline.html" (make sure that file is actually there) and serves the file whenever a network connection can not be made.
```
Snippet:
```js
// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "ToDo-replace-this-name.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
....
```

This is called the App.tsx, bear in mind /sw.js differs from project to project. Thus it must be adjusted to your project structure.
```tsx
function App() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((err) => {
          console.log('ServiceWorker registration failed: ', err);
        });
    }
  }, []);
```

How Service Workers helps:

<b>Fig 1.8 Original **https://southtrackreact.netlify.app/**, on reload in offline with no service workers </b>
<br />
<br />
<img width="1440" alt="Screenshot 2023-10-21 at 02 42 28" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/847c4f35-edd8-4369-a455-eca85635f60f">

<br />
<br />

Firebase-deployed SouthTrack, on reload in offline with service workers - user can still see the pages that are available and navigate between them, but the GET API does not work still
<br />
<br />
<br />
<b>Fig 1.9 Current **https://week-17-audi.web.app/** on reload in offline with service workers </b>
<br />
<br />
<img width="1397" alt="Screenshot 2023-10-21 at 02 45 21" src="https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/cccc264b-2cdb-4766-a7ac-e187e0da38e9">

<br />
<br />
<br />

[Back to Table of Contents](#table-of-contents)
---

## 7. PWA Showcase on Xcode (iOS)

Thanks to **https://www.pwabuilder.com/**, I managed to turn SouthTrack on **week-17-audi.web.app** into an iOS PWA that can be tested in XCode!
The process is fairly simple, once you can pass the **pwabuilder.com**. In this simulator you can enjoy all functionalities you would expect from a web app.
<br />
<br />
<b>Fig 2.0 PWA SouthTrack tested on iPhone 14 Pro - iOS 17.0 Simulator </b>
<br />
<br />
![Group 2 (1)](https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/9829d7e7-1386-44c7-b57f-e170eea06f7f)
<br />
<br />

To try this out, you can just clone the folder `SIOS` (Short for SouthTrack iOS) - and run the `SouthTrack.xcworkspace` on your XCode.

<br />
<br />
<br />

[Back to Table of Contents](#table-of-contents)
---

## 8. PWA Showcase on Android

Also Thanks to **https://www.pwabuilder.com/**, I managed to turn SouthTrack on **week-17-audi.web.app** into an APK for Android (under the folder `SAND`). In this simulator you can enjoy all functionalities you would expect from a web app.

<b>Fig 2.1 PWA SouthTrack promoted by PWABuilder when I visit the web using Android device </b>
<br />
<br />
![Screenshot_20231021-020515_Chrome 1](https://github.com/RevoU-FSSE-2/week-17-audiprevio/assets/126348614/7fd047e8-1f85-4f8e-92da-d920503e93c5)


<br />
<br />
<br />
<br />

[Back to Table of Contents](#table-of-contents)
---


## 9. Big, big thanks
to Kak Dana for the amazing learning materials this week, and to Kak Dion for the timeless guidance✨

[Back to Table of Contents](#table-of-contents)
---
