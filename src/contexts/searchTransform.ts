import { createTransform } from 'redux-persist'

const SearchTransform = createTransform(
  // eslint-disable-next-line unused-imports/no-unused-vars
  ({ showFilterList, modifiedFilterQuery, ...rest }: Record<string, unknown>) =>
    rest,
  (outboundState) => outboundState,
  { whitelist: ['search'] },
)

export default SearchTransform
