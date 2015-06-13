Zend Guard Loader installation instructions
-------------------------------------------

1. Extract the Zend Loader package.

2. Locate and extract the ZendGuardLoader.so (Linux) or ZendLoader.dll (Windows) that corresponds to your php version.

3. Add the following line to your php.ini file for loading the ZendGuardLoader:
   Linux and Mac OS X:      zend_extension=<full_path_to_ZendGuardLoader.so>
   Windows non-thread safe: zend_extension=<full_path_to_ZendLoader.dll>
      
4. Add an aditional line to your php.ini for enabling ZendGuardLoader
  ; Enables loading encoded scripts. The default value is On
  zend_loader.enable=1
     
5. Optional: following lines can be added your php.ini file for ZendGuardLoader configuration:

   ; Disable license checks (for performance reasons)
     zend_loader.disable_licensing=0
   ; The Obfuscation level supported by Zend Guard Loader. The levels are detailed in the official Zend Guard Documentation. 0 - no obfuscation is enabled
     zend_loader.obfuscation_level_support=3
   ; Path to where licensed Zend products should look for the product license. For more information on how to create a license file, see the Zend Guard User Guide
     zend_loader.license_path= 

6. If you use Zend debugger as well, please make sure to load it after the Zend guard Loader

7. If you use ioncube loader, please make sure to load it before Zend guard Loader

8. Restart your Web server.
