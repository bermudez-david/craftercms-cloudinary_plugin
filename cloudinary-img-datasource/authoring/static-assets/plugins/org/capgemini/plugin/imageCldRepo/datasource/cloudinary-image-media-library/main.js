CStudioForms.Datasources.ImageCldRepo = CStudioForms.Datasources.ImageCldRepo ||
function(id, form, properties, constraints)  {
    this.id = id;
    this.form = form;
    this.properties = properties;
    this.constraints = constraints;
    this.selectItemsCount = -1;
    this.type = "";
    this.defaultEnableCreateNew = true;
    this.defaultEnableBrowseExisting = true;
    this.countOptions = 0;

    for (var i = 0; i < properties.length; i++) {
      if (properties[i].name === 'cloud_name') {
        this.cloud_name = properties[i].value;
      }
      if (properties[i].name === 'api_Key') {
        this.api_Key = properties[i].value;
      }
      if (properties[i].name === 'open_folder') {
        this.open_folder = properties[i].value;
      }
    }

    return this;
}

YAHOO.extend(CStudioForms.Datasources.ImageCldRepo, CStudioForms.CStudioFormDatasource, {
    insertImageAction: function (insertCb) {
      let script = document.getElementById("cloudinary-cdn");
      const { cloud_name, api_Key, open_folder } = this;
      const cloudinaryMLWI = {
        cloudinaryConfig: {
          cloud_name,
          api_Key,
          open_folder
        },
        openCloudinary: {
          createTagAndOpenCloudinary
        },
        openCloudinaryCBs: {
          insertImage,
          insertCb
        }
      };

      if(!script) {
        cloudinaryMLWI.openCloudinary.createTagAndOpenCloudinary(cloudinaryMLWI);
      } else {
        openCloudinaryMLWI(cloudinaryMLWI);
      };
    },

    getLabel: function() {
      return "Image from Cloudinary";
    },

    getName: function() {
      return "cloudinary-image-media-library";
    },

    getInterface: function() {
      return 'image';
    },

    getSupportedProperties: function() {
      return [
        { label: "Cloud Name", name: "cloud_name", type: "string" },
        { label: "Api key", name: "api_Key", type: "string" },
        { label: "Open Folder", name: "open_folder", type: "string" },
      ];
    },

    getSupportedConstraints: function() {
      return [];
    }
})

// Cloudinary Video Media Library Widget
//
// Create for first time HTML5 script tag in doc header and open CMLW
function createTagAndOpenCloudinary(cloudinaryMLWI) {
  script = createScriptTag();

  script.onload = () => {
    openCloudinaryMLWI(cloudinaryMLWI);
  };

  document.head.appendChild(script);
}
//
// Open Cloudinary Video Media Library Widget(VMLW)
function openCloudinaryMLWI(cloudinaryMLWI) {
  let expression = cloudinaryMLWI.cloudinaryConfig.open_folder ? `resource_type:image AND folder:${cloudinaryMLWI.cloudinaryConfig.open_folder}/*` : 'resource_type:image';
  window.ml = cloudinary.openMediaLibrary({
    cloud_name: cloudinaryMLWI.cloudinaryConfig.cloud_name,
    api_key: cloudinaryMLWI.cloudinaryConfig.api_Key,
    search: { expression }
  }, {
    // Cloudinary's MLW insert handler
    insertHandler: function (data) {
      cloudinaryMLWI.openCloudinaryCBs.insertImage(data, cloudinaryMLWI.openCloudinaryCBs.insertCb)
    }
  });
}

// Create HTML5 script tag
function createScriptTag () {
  let script = document.createElement('script')
  script.src = "https://media-library.cloudinary.com/global/all.js";
  script.id = "cloudinary-cdn";
  script.async = true;
  
  return script;
}

// Insert the retrieved video 
function insertImage(data, insertCb) {
  data.assets.forEach(asset => { 
    let asset_url = asset.derived ? asset.derived[asset.derived.length - 1].secure_url : asset.secure_url;
    let imageData = {
      previewUrl: asset_url,
      relativeUrl: asset_url,
      fileExtension: asset.format,
      remote: true
    };
    // yui's insert callback
    insertCb.success(imageData, true);
  });
}

CStudioAuthoring.Module.moduleLoaded("cloudinary-image-media-library", CStudioForms.Datasources.ImageCldRepo);