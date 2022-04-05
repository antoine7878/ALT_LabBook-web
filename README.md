# ALT_LabBook web Fullstack
  
> This software was developed between July 2020 and August 2020 by myself as a learning exercise for fullstack developement.  
  
ALT-labBook is a webapp notebook developed for organic chemists  
  
Client developed in TypeScript with React, Apollo, MarvinJS  
Server developed in Typescript with Prisma & GraphQL  
  
The application starts on the Board tab where group card can be created. A group cards have modifiable name, chemical structures and set of compound cards. Groups card can be dragged and dropped in the board and are selected by pressing ctrl + right_click. A compound is added to the selected group. Compounds cards have a modifiable name, chemical structures, and list of experiences (synthesis of the compound). Compound cards can be moved in between groups. All chemical structures can be modified using MarvinJS  
The List tab gives a list of the groups and experiments created. Here groups can be archived to hide them from the Board tab.  
Exps tab displays a list of all experiments and tabs with the opened experiments. Most functionalities of the experiment’s tabs are not implemented.
Data is managed in the client using apollo state management library and sent to a GraphQL server. The database is managed by Prisma.
  
## Youtube Demo
https://youtu.be/KiwdvMStuFI  
  
## Features
-	Creating groups, compounds, exps
-	Drag, drop, pan, zoom, home of group card on the Board
-	Drag and drop of the compound card in groups cards
-	Integration of MarvinJS to modify chemical structures
-	Archiving groups
-	Opening experiments in multi-tab display

## Not implemented:
-	Linking the List tab to open experiments in Exp stab
-	Experiment tabs
-	User identification

## Know bugs:
-	Crash server when moving multiple selected groups card too quickly

## Try it yourself:
Tested on 04/05/2022  

In both server and client folder, run:
```bash
npm install
npm run
```

In client install MarvinJS:  
Download Platform independent (core archive)  
https://chemaxon.com/products/marvin-js/download  
(tested with version 22.6.0)  
Unzip the archive in client/public/marvinjs  
You need to have the file client/public/marvinjs/editor.html  
