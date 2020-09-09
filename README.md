# Twine and Harlowe Save To File Utility
Harlowe utility for saving and loading game progress to encrypted file
# What is Harlowe and Twine?
## Twine
It's a GUI for non-linear text games available at: 
- [Twine's repository](https://github.com/klembot/twinejs "Twine's repository")
- [Twine's WWW site](https://twinery.org/2/)
## Harlowe
It's a macro based scripting language made from Javascript, used inside Twine.
- [Documentation](https://twine2.neocities.org/)
- [Repository](https://foss.heptapod.net/games/harlowe)
# How does this script work
1. Remember that you have to use **Harlowe** story format (tested with 3.1.0)
2. Paste it inside your story script
3. Now you can use additional macros!
## Macros
**NOTE:** Twine (GUI) will mark these macros as incorrect, beacuse they are not its native macros - don't worry, they'll work.
### A `(savetofile: String, String)` macro
This macro pulls your save data **from cookies** - the last time when you used `(save-game:)` and downloads it as an encrypted file. It's important to use `(save-game:)` or checking with `(saved-games:)` before using this macro.
#### It takes **2** arguments
- **slotName** - string containing your slot name. The same as you would use for `(load-game:)` or `(save-game:)` macro.
- **fileName** - string containing your file name, **without extension** for example `my_save`
### A `(savetofiledirect: String, String)` macro
This macro works similar to `(savetofile:)`, but it pulls your save data **directly from Twine**, meaning it doesn't need already saved game. Note, that it doesn't overwrite your cookies, so if you want to save your progress here as well, you should use `(save-game:)` accordingly.
#### It takes **2** arguments (same as before)
- **slotName** - string containing your slot name. The same as you would use for `(load-game:)` or `(save-game:)` macro.
- **fileName** - string containing your file name, **without extension** for example `my_save`
### A `(loadfromfile: String [, ...String])` macro
This macro takes save file and loads it. Simple, right? But, there are few options...
#### It takes **2** arguments
- **slotName** - string containing your slot name to load progress into. Note that if you already have saved game here, **it'll overwrite it**
- **acceptedSlots [optional]** - string**s** containing accepted name slots - if not specified defaults to **slotName**'s value. Note, that if you specify al least one accepted slot, it **won't include slotName** in accepted slots (if you want so, you should **pass it again**). How it works? For ex. if you saved your progress with slotname "SLOT A", and your accepted slot is "SLOT B" it won't work. "SLOT A" must be included in **acceptedSlots**, or if they are not specified - same as **slotName**
## Additional options
Configurables are specified at the top of the file.
- `cheatPassage` (string) if specified instead of saying "Cheater!" (when it detects modifying save file) it goes to specified **passage**
- `maxFileSize` max save file size specified in kilobytes, in most cases 512 is more than enough
- `extension` file extension - default is `sav`
- `binKey` key for the last (3rd) and weakest from of the encryption - integer from **2** to **10*** - higher number - bigger file
## Additional info
### Encryption
Utility uses **a few** types of encryption. All keys (except binKey) are taken from story's **ifid**. It means, that different stories are automatically **incompatible.**
1. Vigenere encryption
2. 8 char checksum
3. Checksum is inserted in various places inside the file
4. Additional scramble using Javascript's `^` operator
#### Where do I find my story's ifid?
- Click `Story statistics` while having your story opened inside Twine
- In HTML published version of your story, it's stored in `ifid` attribute of `tw-storydata` element
### Dialogs
All issues are reported by built-in Twine dialog boxes and JS console :)
### Anti cheat
It uses checksum to determine i file was modified. Also, it checks if **ifid** is correct (however wrong ifid is reported as file from different game - not cheating) 
