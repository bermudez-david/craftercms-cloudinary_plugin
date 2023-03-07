CStudioForms.Datasources.VideoCldRepo = CStudioForms.Datasources.VideoCldRepo ||
function(id, form, properties, constraints)  {
    this.id = id;
    this.form = form;
    this.properties = properties;
    this.constraints = constraints;

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

YAHOO.extend(CStudioForms.Datasources.VideoCldRepo, CStudioForms.CStudioFormDatasource, {
  insertVideoAction: function (insertCb) {
    let script = document.getElementById("cloudinary-cdn");
    const { cloud_name, api_Key, open_folder } = this;
    const cloudinaryMLWV = {
      cloudinaryConfig: {
        cloud_name,
        api_Key,
        open_folder
      },
      openCloudinary: {
        createTagAndOpenCloudinary
      },
      openCloudinaryCBs: {
        insertVideo,
        insertCb
      }
    };

    if(!script) {
      cloudinaryMLWV.openCloudinary.createTagAndOpenCloudinary(cloudinaryMLWV);
    } else {
      openCloudinaryMLWV(cloudinaryMLWV);
    };
  },

  getLabel: function() {
    return "Video from Cloudinary";
  },

  getName: function() {
    return "cloudinary-video-media-library";
  },

  getInterface: function() {
    return 'video';
  },

  getSupportedProperties: function() {
    return [
      { label: "Cloud Name", name: "cloud_name", type: "string", required: true },
      { label: "Api key", name: "api_Key", type: "string" },
      { label: "Open Folder", name: "open_folder", type: "string" }
    ];
  },

  getSupportedConstraints: function() {
    return [];
  }
})


// Cloudinary Video Media Library Widget
//
// Create for first time HTML5 script tag in doc header and open CMLW
function createTagAndOpenCloudinary(cloudinaryMLWV) {
  script = createScriptTag();

  script.onload = () => {
    openCloudinaryMLWV(cloudinaryMLWV);
  };

  document.head.appendChild(script);
}
//
// Open Cloudinary Video Media Library Widget(CVMLW)
function openCloudinaryMLWV(cloudinaryMLWV) {
  let expression = cloudinaryMLWV.cloudinaryConfig.open_folder ? `resource_type:video AND folder:${cloudinaryMLWV.cloudinaryConfig.open_folder}/*` : 'resource_type:video';
  window.ml = cloudinary.openMediaLibrary({
    cloud_name: cloudinaryMLWV.cloudinaryConfig.cloud_name,
    api_key: cloudinaryMLWV.cloudinaryConfig.api_Key,
    search: { expression }
  }, {
    // Cloudinary's MLW insert handler
    insertHandler: function (data) {
      cloudinaryMLWV.openCloudinaryCBs.insertVideo(data, cloudinaryMLWV.openCloudinaryCBs.insertCb)
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
function insertVideo(data, insertCb) {
  data.assets.forEach(asset => { 
    let asset_url = asset.derived ? asset.derived[asset.derived.length - 1].secure_url : asset.secure_url;
    let videoData = {
      previewUrl: asset_url,
      relativeUrl: asset_url,
      fileExtension: asset.format,
      remote: true
    };
    // yui's insert callback
    insertCb.success(videoData, true);
  });
}

CStudioAuthoring.Module.moduleLoaded("cloudinary-video-media-library", CStudioForms.Datasources.VideoCldRepo);