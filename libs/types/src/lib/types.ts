export type SlugCreateRequestPayload = {
  readonly url: string;
  readonly length?: number;
  readonly customSlug?: string;
};

export type SlugCreateResponsePayload = {
  readonly slug: string;
};

export type SlugGetResponsePayload = {
  readonly url: string;
};
