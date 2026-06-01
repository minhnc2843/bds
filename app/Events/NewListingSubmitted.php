<?php

namespace App\Events;

use App\Models\Listing;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewListingSubmitted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Listing $listing) {}

    public function broadcastOn(): array
    {
        // Broadcast lên channel admin
        return [new Channel('admin.notifications')];
    }

    public function broadcastAs(): string
    {
        return 'new.listing.submitted';
    }

    public function broadcastWith(): array
    {
        return [
            'listing_id'    => $this->listing->id,
            'listing_title' => $this->listing->title,
            'user_name'     => $this->listing->user->name,
            'message'       => "Tin mới cần duyệt: \"{$this->listing->title}\"",
        ];
    }
}