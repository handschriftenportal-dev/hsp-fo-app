import { createTransform } from 'redux-persist'

const SearchTransform = createTransform(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ showFilterList, ...rest }: Record<string, unknown>) => rest,
  (outboundState) => outboundState,
  { whitelist: ['search'] },
)

export default SearchTransform
