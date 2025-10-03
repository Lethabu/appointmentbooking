<<<<<<< HEAD
=======

>>>>>>> origin/feat/instyle-whitelabel
interface TenantFooterProps {
  brandName?: string;
  footerHtml?: string;
}

export function TenantFooter({ brandName, footerHtml }: TenantFooterProps) {
  return (
    <footer className="bg-gray-50 border-t py-6 mt-12">
      <div className="container mx-auto text-center text-gray-500">
        {footerHtml ? (
          <div dangerouslySetInnerHTML={{ __html: footerHtml }} />
        ) : (
<<<<<<< HEAD
          <p>
            &copy; {new Date().getFullYear()}{' '}
            {brandName || 'All Rights Reserved'}
          </p>
=======
          <p>&copy; {new Date().getFullYear()} {brandName || 'All Rights Reserved'}</p>
>>>>>>> origin/feat/instyle-whitelabel
        )}
      </div>
    </footer>
  );
}
