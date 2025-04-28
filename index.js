const express = require("express")
const app = express()
const cors = require("cors")

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

const { initializeDatabase } = require("./db/db.connect")
const Volume = require("./models/volume.models")

app.use(express.json())

initializeDatabase()

//-------------------------------------------------------------------------------------
async function createVolume(newVolume) {
  try {
    const volume = new Volume(newVolume)
    const savedVolume = await volume.save()
    return savedVolume
  } catch (error) {
    throw error
  }
}

app.post("/volumes", async (req, res) => {
  try {
    const savedVolume = await createVolume(req.body)
    res
      .status(201)
      .json({ message: "Volume added successfully.", volume: savedVolume })
  } catch (error) {
    res.status(500).json({ error: "Failed to add volume" })
  }
})

//-------------------------------------------------------------------------------------

async function readAllVolumes() {
  try {
    const allVolumes = await Volume.find()
    return allVolumes
  } catch (error) {
    console.log(error)
    throw error
  }
}
app.get("/volumes", async (req, res) => {
  try {
    const volumes = await readAllVolumes()
    if (volumes.length != 0) {
      res.json(volumes)
    } else {
      res.json({ error: "No volumes found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch volumes." })
  }
})

//-------------------------------------------------------------------------------------

async function deleteVolume(volumeId) {
  try {
    const deletedVolume = await Volume.findByIdAndDelete(volumeId)
    return deletedVolume
  } catch (error) {
    console.log(error)
    throw error
  }
}

app.delete("/volumes/:volumeId", async (req, res) => {
  try {
    const deletedVolume = await deleteVolume(req.params.volumeId)
    if (deletedVolume) {
      res.status(200).json({ message: "Volume deleted successfully." })
    } else {
      res.status(404).json({ error: "Volume not found" })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete volume." })
  }
})
//-------------------------------------------------------------------------------------
async function readVolumeByTitle(volumeTitle) {
  try {
    const volume = await Volume.findOne({ title: volumeTitle })
    return volume
  } catch (error) {
    throw error
  }
}

app.get("/volumes/:title", async (req, res) => {
  try {
    const volume = await readVolumeByTitle(req.params.title)
    if (volume) {
      res.status(200).json(volume)
    } else {
      res.status(404).json({ error: "Volume not found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch volume." })
  }
})

//-------------------------------------------------------------------------------------

async function updateVolume(volumeId, dataToUpdate) {
  try {
    const updatedVolume = await Volume.findByIdAndUpdate(
      volumeId,
      dataToUpdate,
      {
        new: true,
      }
    )
    return updatedVolume
  } catch (error) {
    console.log("Error in updating Volume details", error)
    throw error
  }
}

app.post("/volumes/:volumeId", async (req, res) => {
  try {
    const updatedVolume = await updateVolume(req.params.volumeId, req.body)
    if (updatedVolume) {
      res.status(200).json({
        message: "Volume updated successfully.",
        updatedVolume: updatedVolume,
      })
    } else {
      res.status(404).json({ error: "Volume not found." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update volume." })
  }
})

//-------------------------------------------------------------------------------------
// 5. Get details of all books by an author
async function getVolumesByAuthor(authorName) {
  try {
    const volumes = await Volume.find({ author: authorName })
    return volumes
  } catch (error) {
    throw error
  }
}

app.get("/volumes/author/:author", async (req, res) => {
  try {
    const volumes = await getVolumesByAuthor(req.params.author)
    if (volumes && volumes.length > 0) {
      res.status(200).json(volumes)
    } else {
      res.status(404).json({ error: "No volumes found for this author." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch volumes by author." })
  }
})

//-------------------------------------------------------------------------------------
// 6. Get all books of "Business" genre
async function getVolumesByGenre(genre) {
  try {
    const volumes = await Volume.find({ genre: genre })
    return volumes
  } catch (error) {
    throw error
  }
}

app.get("/volumes/genre/:genre", async (req, res) => {
  try {
    const volumes = await getVolumesByGenre(req.params.genre)
    if (volumes && volumes.length > 0) {
      res.status(200).json(volumes)
    } else {
      res.status(404).json({ error: "No volumes found for this genre." })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch volumes by genre." })
  }
})

//-------------------------------------------------------------------------------------
// 7. Get all books released in the year 2012
async function getVolumesByYear(year) {
  try {
    const volumes = await Volume.find({ publishedYear: year })
    return volumes
  } catch (error) {
    throw error
  }
}

app.get("/volumes/year/:year", async (req, res) => {
  try {
    const volumes = await getVolumesByYear(req.params.year)
    if (volumes && volumes.length > 0) {
      res.status(200).json(volumes)
    } else {
      res
        .status(404)
        .json({ error: `No volumes found for the year ${req.params.year}.` })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch volumes by year." })
  }
})

//-------------------------------------------------------------------------------------

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
