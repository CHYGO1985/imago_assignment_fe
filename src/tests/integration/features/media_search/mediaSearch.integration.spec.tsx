// import { http, HttpResponse, PathParams } from 'msw';
// import { setupServer } from 'msw/node';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import MediaSearchPage from '../../../../features/media_search/components/MediaSearchPage';
// import { MediaResponse } from '../../../../types/media';

// const server = setupServer(
//   http.get<PathParams, undefined, MediaResponse>(
//     'http://localhost:8080/api/v1/media/search',
//     async (req) => {
//       const q = new URL(req.request.url).searchParams.get('query');
//       return HttpResponse.json({
//         total: 2,
//         page: 1,
//         size: 15,
//         results: [
//           {
//             id: 'a',
//             title: `Title for ${q}`,
//             description: 'Desc',
//             date: '2021-02-02T00:00:00.000Z',
//             photographer: 'Bob',
//             width: 100,
//             height: 100,
//             thumbnailUrl: 'https://ex.com/img/s.jpg',
//           },
//         ],
//       });
//     },
//   ),
// );

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// test('full media search flow: user submits a valid search request and sees results', async () => {
//   render(<MediaSearchPage />);

//   expect(screen.getByRole('progressbar')).toBeInTheDocument();

//   await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

//   fireEvent.change(screen.getByLabelText(/search/i), {
//     target: { value: 'foobar' },
//   });
//   fireEvent.click(screen.getByRole('button', { name: /search/i }));

//   expect(screen.getByRole('progressbar')).toBeInTheDocument();

//   await waitFor(() => screen.getByText('Title for foobar'));
//   expect(screen.getByText('Title for foobar')).toBeVisible();
//   expect(screen.getByText('Bob')).toBeVisible();
//   expect(screen.getByText('02/02/2021')).toBeVisible();
// });
