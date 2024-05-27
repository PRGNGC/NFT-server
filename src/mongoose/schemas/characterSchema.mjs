import mongoose from "mongoose";

const CharacterSchema = new mongoose.Schema({
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
});

export const Character = mongoose.model("Character", CharacterSchema);
