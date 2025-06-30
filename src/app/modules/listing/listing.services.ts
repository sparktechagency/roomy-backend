import IListing from './listing.interface';
import Listing from './listing.model';

const createListingIntoDb = async (id: string, data: IListing, files: any) => {
  const roomImages = files.room_gallery?.map((file: Express.Multer.File) => file.path) || [];

  const newListingData = {
    ...data,
    roomGallery: roomImages,
  };
  const newListing = await Listing.create(newListingData);

  return newListing;
};

export default {
  createListingIntoDb,
};
