export const idlFactory = ({ IDL }) => {
  const TokenIdentifier = IDL.Text;
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : AccountIdentifier,
  });
  const Request__1 = IDL.Record({
    'token' : TokenIdentifier,
    'owner' : User,
    'spender' : IDL.Principal,
  });
  const Balance = IDL.Nat;
  const CommonError = IDL.Variant({
    'InvalidToken' : TokenIdentifier,
    'Other' : IDL.Text,
  });
  const Response__1 = IDL.Variant({ 'ok' : Balance, 'err' : CommonError });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const ApproveRequest = IDL.Record({
    'token' : TokenIdentifier,
    'subaccount' : IDL.Opt(SubAccount),
    'allowance' : Balance,
    'spender' : IDL.Principal,
  });
  const TokenIndex__1 = IDL.Nat32;
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const Request = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingCallback = IDL.Func(
      [StreamingCallbackToken],
      [StreamingCallbackResponse],
      ['query'],
    );
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : StreamingCallback,
    }),
  });
  const Response = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const Metadata = IDL.Variant({
    'fungible' : IDL.Record({
      'decimals' : IDL.Nat8,
      'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'name' : IDL.Text,
      'symbol' : IDL.Text,
    }),
    'nonfungible' : IDL.Record({ 'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)) }),
  });
  const MetadataResponse = IDL.Variant({
    'ok' : Metadata,
    'err' : CommonError,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Card = IDL.Record({
    'chaos' : IDL.Nat8,
    'image' : IDL.Text,
    'index' : IDL.Nat8,
  });
  const MetaData = IDL.Record({
    'thumbnail' : IDL.Text,
    'cards' : IDL.Vec(Card),
    'name' : IDL.Text,
    'description' : IDL.Text,
    'artists' : IDL.Vec(IDL.Text),
    'image' : IDL.Text,
  });
  const Token = IDL.Record({
    'owner' : AccountIdentifier,
    'metadata' : MetaData,
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Vec(TokenIndex__1),
    'err' : CommonError,
  });
  const TokenIndex = IDL.Nat32;
  const Listing = IDL.Record({
    'locked' : IDL.Opt(IDL.Int),
    'seller' : IDL.Principal,
    'price' : IDL.Nat64,
  });
  const TokenExt = IDL.Tuple(
    TokenIndex,
    IDL.Opt(IDL.Vec(Listing)),
    IDL.Opt(IDL.Vec(IDL.Nat8)),
  );
  const Result_1 = IDL.Variant({
    'ok' : IDL.Vec(TokenExt),
    'err' : CommonError,
  });
  const Memo = IDL.Vec(IDL.Nat8);
  const TransferRequest = IDL.Record({
    'to' : User,
    'token' : TokenIdentifier,
    'notify' : IDL.Bool,
    'from' : User,
    'memo' : Memo,
    'subaccount' : IDL.Opt(SubAccount),
    'amount' : Balance,
  });
  const TransferResponse = IDL.Variant({
    'ok' : Balance,
    'err' : IDL.Variant({
      'CannotNotify' : AccountIdentifier,
      'InsufficientBalance' : IDL.Null,
      'InvalidToken' : TokenIdentifier,
      'Rejected' : IDL.Null,
      'Unauthorized' : AccountIdentifier,
      'Other' : IDL.Text,
    }),
  });
  const Tag = IDL.Text;
  const FilePath = IDL.Text;
  const Meta = IDL.Record({
    'name' : IDL.Text,
    'tags' : IDL.Vec(Tag),
    'description' : IDL.Text,
    'filename' : FilePath,
  });
  const InternetComputerNFTCanister = IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [], []),
    'airdrop' : IDL.Func([], [], []),
    'allowance' : IDL.Func([Request__1], [Response__1], []),
    'approve' : IDL.Func([ApproveRequest], [], []),
    'buildWhitelist' : IDL.Func([], [], []),
    'decks' : IDL.Func([], [IDL.Vec(TokenIndex__1)], ['query']),
    'getAdmins' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'http_request' : IDL.Func([Request], [Response], ['query']),
    'installCap' : IDL.Func([], [], []),
    'isAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'metadata' : IDL.Func([TokenIdentifier], [MetadataResponse], ['query']),
    'mintRandom' : IDL.Func([IDL.Principal], [], []),
    'purgeAssets' : IDL.Func([IDL.Text, IDL.Opt(IDL.Text)], [Result], []),
    'readLedger' : IDL.Func([], [IDL.Vec(IDL.Opt(Token))], ['query']),
    'readWhitelist' : IDL.Func([], [IDL.Vec(TokenIdentifier)], ['query']),
    'removeAdmin' : IDL.Func([IDL.Principal], [], []),
    'tokenId' : IDL.Func([TokenIndex__1], [TokenIdentifier], ['query']),
    'tokens' : IDL.Func([AccountIdentifier], [Result_2], ['query']),
    'tokens_ext' : IDL.Func([AccountIdentifier], [Result_1], ['query']),
    'transfer' : IDL.Func([TransferRequest], [TransferResponse], []),
    'upload' : IDL.Func([IDL.Vec(IDL.Vec(IDL.Nat8))], [], []),
    'uploadClear' : IDL.Func([], [], []),
    'uploadFinalize' : IDL.Func([IDL.Text, Meta], [Result], []),
  });
  return InternetComputerNFTCanister;
};
export const init = ({ IDL }) => { return [IDL.Text, IDL.Text, IDL.Text]; };
