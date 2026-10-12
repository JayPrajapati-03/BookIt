import React, { useState } from 'react';
import {
  Button,
  Field,
  Badge,
  Skeleton,
  EmptyState,
  Dialog,
  Drawer,
} from '../components/common/index.js';
import { Calendar, Search, ShieldCheck, Sparkles } from 'lucide-react';
import styles from './UiPreviewPage.module.css';

export const UiPreviewPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>BookIt Design System & Component Preview</h1>
        <p className={styles.subtitle}>
          Living catalog of design tokens, interactive components, and state variants.
        </p>
      </header>

      {/* 1. Core Color Palette Tokens */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Curated Palette Tokens</h2>
        <div className={styles.grid}>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: '#F5F7F6' }} />
            <span className={styles.label}>Chalk (Canvas)</span>
            <span className={styles.code}>#F5F7F6</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: '#0F2B2E' }} />
            <span className={styles.label}>Lagoon (Primary Ink)</span>
            <span className={styles.code}>#0F2B2E</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: '#1F6F78' }} />
            <span className={styles.label}>Tide (Accent / Links)</span>
            <span className={styles.code}>#1F6F78</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: '#F2B33D' }} />
            <span className={styles.label}>Marigold (Action)</span>
            <span className={styles.code}>#F2B33D</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: '#D9482B' }} />
            <span className={styles.label}>Signal (Scarcity / Alert)</span>
            <span className={styles.code}>#D9482B</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: '#D6DCD9' }} />
            <span className={styles.label}>Stone (Hairline)</span>
            <span className={styles.code}>#D6DCD9</span>
          </div>
        </div>
      </section>

      {/* 2. Button Component States */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Button Variants & States</h2>
        <div className={styles.row}>
          <Button variant="primary">Primary Marigold</Button>
          <Button variant="secondary">Secondary Lagoon</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="danger">Destructive</Button>
        </div>
        <div className={styles.row}>
          <Button variant="primary" isLoading>
            Holding Room...
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="outline" leftIcon={<Calendar size={16} />}>
            Select Dates
          </Button>
          <Button variant="secondary" rightIcon={<Sparkles size={16} />}>
            Special Offer
          </Button>
        </div>
        <div className={styles.row}>
          <Button size="sm">Small (36px)</Button>
          <Button size="md">Medium (44px AA target)</Button>
          <Button size="lg">Large (52px)</Button>
        </div>
      </section>

      {/* 3. Field Component States */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Field Component States</h2>
        <div className={styles.grid}>
          <Field
            label="Guest Full Name"
            placeholder="e.g. Aditi Rao"
            defaultValue="Aditi Rao"
            required
          />
          <Field
            label="Email Address"
            type="email"
            placeholder="aditi@example.com"
            hint="Booking confirmation will be sent here."
          />
          <Field
            label="Phone Number"
            placeholder="+91 98765 43210"
            error="Please enter a valid 10-digit mobile number."
            defaultValue="987"
          />
          <Field
            label="Special Requests (Disabled)"
            placeholder="Not editable during checkout"
            disabled
            defaultValue="Quiet room on higher floor"
          />
        </div>
      </section>

      {/* 4. Badges */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Status Badges</h2>
        <div className={styles.row}>
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="success" icon={<ShieldCheck size={14} />}>
            Confirmed
          </Badge>
          <Badge variant="warning">Hold Active (08:42)</Badge>
          <Badge variant="danger">2 Rooms Left</Badge>
          <Badge variant="accent">Top Rated (4.9)</Badge>
        </div>
      </section>

      {/* 5. Skeleton Loaders */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Skeleton Content Loaders</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
          <Skeleton height="32px" width="60%" />
          <Skeleton height="16px" width="100%" />
          <Skeleton height="16px" width="85%" />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <Skeleton height="44px" width="120px" borderRadius="6px" />
            <Skeleton height="44px" width="120px" borderRadius="6px" />
          </div>
        </div>
      </section>

      {/* 6. Empty State */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Empty State Component</h2>
        <EmptyState
          icon={<Search size={28} />}
          title="No properties available for these dates"
          description="Try adjusting your stay dates or explore properties in nearby destinations like Udaipur or Jaipur."
          action={<Button variant="outline">Reset Search Filters</Button>}
        />
      </section>

      {/* 7. Dialog & Drawer Modals */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Overlays (Dialog & Drawer)</h2>
        <div className={styles.row}>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            Open Accessible Dialog
          </Button>
          <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
            Open Slide-out Drawer
          </Button>
        </div>

        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Cancellation Policy"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Dismiss
              </Button>
              <Button variant="primary" onClick={() => setIsDialogOpen(false)}>
                Understood
              </Button>
            </>
          }
        >
          <p>
            Free cancellation is available up to 48 hours before check-in. Cancellations made within
            48 hours are subject to a 50% penalty of the first night tariff.
          </p>
        </Dialog>

        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Walk-In Quick Reservation"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setIsDrawerOpen(false)}>
                Confirm Walk-In
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Field label="Guest Name" placeholder="Walk-in guest name" />
            <Field label="Room Assigned" defaultValue="Room 104 - Deluxe Haveli" disabled />
            <Field label="Check-Out Date" defaultValue="Tomorrow" />
          </div>
        </Drawer>
      </section>
    </div>
  );
};
