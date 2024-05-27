import mongoose from "mongoose";

const BundleSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.String, required: true },
  nftImg: { type: mongoose.Schema.Types.String, required: true },
  nftId: { type: mongoose.Schema.Types.String, required: true },
  nftEthPrice: { type: mongoose.Schema.Types.String, required: true },
  nftName: { type: mongoose.Schema.Types.String, required: true },
  nftDescription: { type: mongoose.Schema.Types.String, required: true },
  nftCategory: { type: mongoose.Schema.Types.String, required: true },
  nftType: { type: mongoose.Schema.Types.String, required: true },
  nftTraits: { type: mongoose.Schema.Types.String, required: false },
  similarNfts: { type: mongoose.Schema.Types.Array, required: true },
  history: { type: mongoose.Schema.Types.Mixed, required: true },
  nftDetails: { type: mongoose.Schema.Types.Mixed, required: true },
  nftLevelRequirement: { type: mongoose.Schema.Types.Number, required: true },
  itemsInBundle: { type: mongoose.Schema.Types.Array, required: true },
});

export const Bundle = mongoose.model("Bundle", BundleSchema);
