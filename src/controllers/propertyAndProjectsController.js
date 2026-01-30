import { uploadOnCloudinary } from '../utils/cloudinary.js';
import propertiesAndProjectModel from '../models/propertyAndProjectsModel.js';

// CREATE DOCUMENT
// export const propertiesAndProject = async (req, res) => {
//   try {
//     const {
//       propertyCategory,
//       projectCategory,
//       properties,
//       projects,
//     } = req.body;

//     //Validate input
//     if (
//       (!properties || !Array.isArray(properties) || properties.length === 0) &&
//       (!projects || !Array.isArray(projects) || projects.length === 0)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: 'At least one property or project is required',
//       });
//     }

//     let record = null;

//     // If PROPERTY category exists → add properties
//     if (propertyCategory && properties?.length) {
//       record = await propertiesAndProjectModel.findOne({
//         propertyCategory: propertyCategory.toLowerCase(),
//       });

//       if (record) {
//         record.properties.push(...properties);
//       }
//     }

//     // If PROJECT category exists → add projects
//     if (!record && projectCategory && projects?.length) {
//       record = await propertiesAndProjectModel.findOne({
//         projectCategory: projectCategory.toLowerCase(),
//       });

//       if (record) {
//         record.projects.push(...projects);
//       }
//     }

//     // If NO category exists → create new
//     if (!record) {
//       record = new propertiesAndProjectModel({
//         propertyCategory: propertyCategory?.toLowerCase(),
//         projectCategory: projectCategory?.toLowerCase(),
//         properties: properties || [],
//         projects: projects || [],
//       });
//     }

//     // Save
//     await record.save();

//     res.status(201).json({
//       success: true,
//       message: record.isNew
//         ? 'Category created and record added successfully'
//         : 'Record added to existing category successfully',
//       data: record,
//     });

//   } catch (error) {
//     console.error('Create Property/Project Error:', error);

//     res.status(500).json({
//       success: false,
//       message: 'Error creating property/project',
//       error: error.message,
//     });
//   }
// };

export const propertiesAndProject = async (req, res) => {
  try {
    let { propertyCategory, projectCategory, properties, projects } = req.body;
    
      //  PARSE JSON (form-data)
    if (properties && typeof properties === 'string') {
      properties = JSON.parse(properties);
    }

    if (projects && typeof projects === 'string') {
      projects = JSON.parse(projects);
    }

    
    //  VALIDATION
    if (
      (!properties || !Array.isArray(properties) || properties.length === 0) &&
      (!projects || !Array.isArray(projects) || projects.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'At least one property or project is required',
      });
    }

    //  UPLOAD PROPERTY IMAGES
    if (req.files?.propertyImages?.length && properties?.length) {
      const propertyImages = [];

      for (const file of req.files.propertyImages) {
        const uploaded = await uploadOnCloudinary(
          file.path,
          'Palghar_images/properties'
        );

        if (uploaded) {
          propertyImages.push({
            url: uploaded.url,
            publicId: uploaded.public_id,
          });
        }
      }

      properties[0].images = propertyImages;
    }

    //  UPLOAD PROJECT IMAGE
    if (req.files?.projectImage?.length && projects?.length) {
      const file = req.files.projectImage[0];

      const uploaded = await uploadOnCloudinary(
        file.path,
        'Palghar_images/projects'
      );

      if (uploaded) {
        projects[0].image = {
          url: uploaded.url,
          publicId: uploaded.public_id,
        };
      }
    }
    
    //  FIND OR CREATE DOCUMENT
    let record = await propertiesAndProjectModel.findOne({
      $or: [
        { propertyCategory: propertyCategory?.toLowerCase() },
        { projectCategory: projectCategory?.toLowerCase() },
      ],
    });

    let isNewCategory = false;

    if (!record) {
      record = new propertiesAndProjectModel({
        propertyCategory: propertyCategory?.toLowerCase(),
        projectCategory: projectCategory?.toLowerCase(),
        properties: properties || [],
        projects: projects || [],
      });
      isNewCategory = true;
    } else {
      if (properties?.length) {
        record.properties.push(...properties);
      }
      if (projects?.length) {
        record.projects.push(...projects);
      }
    }

    await record.save();

    return res.status(201).json({
      success: true,
      message: isNewCategory
        ? 'Category created and record added successfully'
        : 'Record added to existing category successfully',
      data: record,
    });
  } catch (error) {
    console.error('Create Property/Project Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Error creating property/project',
      error: error.message,
    });
  }
};


// GET ALL DOCUMENT
export const getAllPropertiesAndProjects = async (req, res) => {
  try {
    const data = await propertiesAndProjectModel.find();

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching data',
      error: error.message,
    });
  }
};

// GET SINGLE DOCUMENT BY ID
export const getPropertiesAndProjectsById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await propertiesAndProjectModel.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching record',
      error: error.message,
    });
  }
};

// UPDATE PROPERTY (By propertyId)
export const updateProperty = async (req, res) => {
  try {
    const { id, propertyId } = req.params;

    const record = await propertiesAndProjectModel.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    const property = record.properties.id(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Update text fields
    Object.assign(property, req.body);

    // Upload multiple images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(
          file.path,
          'Palghar_images/properties'
        );

        if (uploaded) {
          property.images.push({
            url: uploaded.url,
            publicId: uploaded.publicId,
          });
        }
      }
    }

    await record.save();

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating property',
      error: error.message,
    });
  }
};


// UPDATE PROJECT (By projectId)
export const updateProject = async (req, res) => {
  try {
    const { id, projectId } = req.params;

    const record = await propertiesAndProjectModel.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    const project = record.projects.id(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    Object.assign(project, req.body);

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(
          file.path,
          'Palghar_images/projects'
        );

        if (uploaded) {
          project.images.push({
            url: uploaded.url,
            publicId: uploaded.publicId,
          });
        }
      }
    }

    await record.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message,
    });
  }
};



// DELETE PROPERTY
export const deleteProperty = async (req, res) => {
  try {
    const { id, propertyId } = req.params;

    const record = await propertiesAndProjectModel.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record.properties.id(propertyId).deleteOne();
    await record.save();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message,
    });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const { id, projectId } = req.params;

    const record = await propertiesAndProjectModel.findById(id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record.projects.id(projectId).deleteOne();
    await record.save();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message,
    });
  }
};

// DELETE WHOLE DOCUMENT
export const deletePropertiesAndProjects = async (req, res) => {
  try {
    const { id } = req.params;

    await propertiesAndProjectModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Record deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting record',
      error: error.message,
    });
  }
};
