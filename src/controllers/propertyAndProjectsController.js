import propertiesAndProjectModel from "../models/propertyAndProjectsModel.js";


// CREATE DOCUMENT 
export const propertiesAndProject = async (req, res) => {
  try {
    const {
      propertyCategory,
      projectCategory,
      properties,
      projects,
    } = req.body;

    // 1️⃣ Validate input
    if (
      (!properties || !Array.isArray(properties) || properties.length === 0) &&
      (!projects || !Array.isArray(projects) || projects.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'At least one property or project is required',
      });
    }

    let record = null;

    // 2️⃣ If PROPERTY category exists → add properties
    if (propertyCategory && properties?.length) {
      record = await propertiesAndProjectModel.findOne({
        propertyCategory: propertyCategory.toLowerCase(),
      });

      if (record) {
        record.properties.push(...properties);
      }
    }

    // 3️⃣ If PROJECT category exists → add projects
    if (!record && projectCategory && projects?.length) {
      record = await propertiesAndProjectModel.findOne({
        projectCategory: projectCategory.toLowerCase(),
      });

      if (record) {
        record.projects.push(...projects);
      }
    }

    // 4️⃣ If NO category exists → create new
    if (!record) {
      record = new propertiesAndProjectModel({
        propertyCategory: propertyCategory?.toLowerCase(),
        projectCategory: projectCategory?.toLowerCase(),
        properties: properties || [],
        projects: projects || [],
      });
    }

    // 5️⃣ Save
    await record.save();

    res.status(201).json({
      success: true,
      message: record.isNew
        ? 'Category created and record added successfully'
        : 'Record added to existing category successfully',
      data: record,
    });

  } catch (error) {
    console.error('Create Property/Project Error:', error);

    res.status(500).json({
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

    Object.assign(property, req.body);
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

