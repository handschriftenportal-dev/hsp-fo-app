jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [() => undefined, undefined],
}))

export {}
