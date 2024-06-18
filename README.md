## NiimbotJS Tools

A web tool for tinkering with [Niimbot](https://www.niimbot.net/enweb/) label printers.  The data used by the tool comes from exported [WireShark](https://www.wireshark.org/) packet dissections.  

[View the tool on GitHub pages](https://dtgreene.github.io/niimbotjs-tools/dist/)

Most of the packet info came from [kjy00302/niimprint](https://github.com/kjy00302/niimprint) and [AndBondStyle/niimprint](https://github.com/AndBondStyle/niimprint)

### Packet Explorer
The packet explorer is similar to the view you get in WireShark but the packet is decoded based on how Niimbot packets are structured.  You can view the packet codes used by the name column [here](https://github.com/dtgreene/niimbotjs-tools/blob/main/src/lib/packets.js).  Clicking on one of the payload bytes columns will open the bytes inspector which is useful when you aren't sure what data is stored in the packet.

![Screenshot 2024-06-17 at 22-40-26 NiimbotJS Tools](https://github.com/dtgreene/niimbotjs-tools/assets/24302976/ca2898d3-9a7c-4203-9773-5e8c78751063)
![Screenshot 2024-06-17 at 22-40-36 NiimbotJS Tools](https://github.com/dtgreene/niimbotjs-tools/assets/24302976/18c8bcfc-663d-4c08-8f45-865ae31c98fb)

### Image Data Viewer
This tool attempts to reconstruct the images transmitted to the printer including the optimizations done by the stock app.  

![Screenshot 2024-06-17 at 22-40-53 NiimbotJS Tools](https://github.com/dtgreene/niimbotjs-tools/assets/24302976/a25b0e85-8586-4dd8-9c35-54fd139a6d22)

### Calibrate Label
This tool generates a calibration label that can be useful when checking your alignment.

![Screenshot 2024-06-17 at 22-41-00 NiimbotJS Tools](https://github.com/dtgreene/niimbotjs-tools/assets/24302976/0820c579-c883-47f8-aaae-16782944313a)
