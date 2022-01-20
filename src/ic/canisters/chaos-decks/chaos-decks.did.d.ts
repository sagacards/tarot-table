import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = string;
export interface ApproveRequest {
  'token' : TokenIdentifier,
  'subaccount' : [] | [SubAccount],
  'allowance' : Balance,
  'spender' : Principal,
}
export type Balance = bigint;
export interface Card { 'chaos' : number, 'image' : string, 'index' : number }
export type CommonError = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export type FilePath = string;
export type HeaderField = [string, string];
export interface InternetComputerNFTCanister {
  'addAdmin' : (arg_0: Principal) => Promise<undefined>,
  'airdrop' : () => Promise<undefined>,
  'allowance' : (arg_0: Request__1) => Promise<Response__1>,
  'approve' : (arg_0: ApproveRequest) => Promise<undefined>,
  'buildWhitelist' : () => Promise<undefined>,
  'decks' : () => Promise<Array<TokenIndex__1>>,
  'getAdmins' : () => Promise<Array<Principal>>,
  'http_request' : (arg_0: Request) => Promise<Response>,
  'installCap' : () => Promise<undefined>,
  'isAdmin' : (arg_0: Principal) => Promise<boolean>,
  'metadata' : (arg_0: TokenIdentifier) => Promise<MetadataResponse>,
  'mintRandom' : (arg_0: Principal) => Promise<undefined>,
  'purgeAssets' : (arg_0: string, arg_1: [] | [string]) => Promise<Result>,
  'readLedger' : () => Promise<Array<[] | [Token]>>,
  'readWhitelist' : () => Promise<Array<TokenIdentifier>>,
  'removeAdmin' : (arg_0: Principal) => Promise<undefined>,
  'tokenId' : (arg_0: TokenIndex__1) => Promise<TokenIdentifier>,
  'tokens' : (arg_0: AccountIdentifier) => Promise<Result_2>,
  'tokens_ext' : (arg_0: AccountIdentifier) => Promise<Result_1>,
  'transfer' : (arg_0: TransferRequest) => Promise<TransferResponse>,
  'upload' : (arg_0: Array<Array<number>>) => Promise<undefined>,
  'uploadClear' : () => Promise<undefined>,
  'uploadFinalize' : (arg_0: string, arg_1: Meta) => Promise<Result>,
}
export interface Listing {
  'locked' : [] | [bigint],
  'seller' : Principal,
  'price' : bigint,
}
export type Memo = Array<number>;
export interface Meta {
  'name' : string,
  'tags' : Array<Tag>,
  'description' : string,
  'filename' : FilePath,
}
export interface MetaData {
  'thumbnail' : string,
  'cards' : Array<Card>,
  'name' : string,
  'description' : string,
  'artists' : Array<string>,
  'image' : string,
}
export type Metadata = {
    'fungible' : {
      'decimals' : number,
      'metadata' : [] | [Array<number>],
      'name' : string,
      'symbol' : string,
    }
  } |
  { 'nonfungible' : { 'metadata' : [] | [Array<number>] } };
export type MetadataResponse = { 'ok' : Metadata } |
  { 'err' : CommonError };
export interface Request {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface Request__1 {
  'token' : TokenIdentifier,
  'owner' : User,
  'spender' : Principal,
}
export interface Response {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export type Response__1 = { 'ok' : Balance } |
  { 'err' : CommonError };
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Array<TokenExt> } |
  { 'err' : CommonError };
export type Result_2 = { 'ok' : Array<TokenIndex__1> } |
  { 'err' : CommonError };
export type StreamingCallback = (arg_0: StreamingCallbackToken) => Promise<
    StreamingCallbackResponse
  >;
export interface StreamingCallbackResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Array<number>,
}
export interface StreamingCallbackToken {
  'key' : string,
  'index' : bigint,
  'content_encoding' : string,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : StreamingCallback,
    }
  };
export type SubAccount = Array<number>;
export type Tag = string;
export interface Token { 'owner' : AccountIdentifier, 'metadata' : MetaData }
export type TokenExt = [
  TokenIndex,
  [] | [Array<Listing>],
  [] | [Array<number>],
];
export type TokenIdentifier = string;
export type TokenIndex = number;
export type TokenIndex__1 = number;
export interface TransferRequest {
  'to' : User,
  'token' : TokenIdentifier,
  'notify' : boolean,
  'from' : User,
  'memo' : Memo,
  'subaccount' : [] | [SubAccount],
  'amount' : Balance,
}
export type TransferResponse = { 'ok' : Balance } |
  {
    'err' : { 'CannotNotify' : AccountIdentifier } |
      { 'InsufficientBalance' : null } |
      { 'InvalidToken' : TokenIdentifier } |
      { 'Rejected' : null } |
      { 'Unauthorized' : AccountIdentifier } |
      { 'Other' : string }
  };
export type User = { 'principal' : Principal } |
  { 'address' : AccountIdentifier };
export interface _SERVICE extends InternetComputerNFTCanister {}
