import { ButtonLink, Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="py-32">
      <p className="label">404</p>
      <h1 className="mt-6 text-display font-semibold">This page doesn&apos;t exist.</h1>
      <p className="mt-6 max-w-xl text-lede text-muted">The link may be from an older version of the site, which used single-page sections.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/work" variant="secondary">
          Browse work
        </ButtonLink>
      </div>
    </Container>
  );
}
