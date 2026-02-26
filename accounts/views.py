from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

from .forms import SignupForm
from .models import Note


def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = SignupForm()

    return render(request, 'signup.html', {'form': form})


@login_required
def dashboard(request):

    if request.user.role in ['ADMIN', 'MANAGER']:
        notes = Note.objects.all()
    else:
        notes = Note.objects.filter(owner=request.user)

    return render(request, 'dashboard.html', {'notes': notes})


@login_required
@require_POST
def add_note(request):
    data = json.loads(request.body)
    content = data.get("content")

    if not content:
        return JsonResponse({"error": "Empty note"}, status=400)

    Note.objects.create(
        owner=request.user,
        content=content
    )

    return JsonResponse({"status": "success"})